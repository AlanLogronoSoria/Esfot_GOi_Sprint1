import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useExpressAuthStore } from '@/services/express/express-auth.store';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  AppState,
  TouchableOpacity,
  Modal,
} from 'react-native';
import type { AppStateStatus } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DarkTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';

const SESSION_CHECK_INTERVAL_MS = 4 * 60 * 1000;
const APP_BACKGROUND_TIMEOUT_MS = 15 * 60 * 1000;
const INACTIVITY_WARNING_MS = 28 * 60 * 1000;
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_REFRESH_RETRIES = 3;

const AuthContext = createContext<{
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionValid: boolean;
  sessionExpiryWarning: boolean;
  extendSession: () => void;
}>({
  isAuthenticated: false,
  isLoading: true,
  isSessionValid: false,
  sessionExpiryWarning: false,
  extendSession: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isSessionValid = useAuthStore((s) => s.isSessionValid);
  const initialize = useAuthStore((s) => s.initialize);
  const validateCurrentSession = useAuthStore((s) => s.validateCurrentSession);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const secureLogout = useAuthStore((s) => s.secureLogout);
  const initializeExpress = useExpressAuthStore((s) => s.initializeExpress);

  const appStateRef = useRef<AppStateStatus>('active');
  const backgroundTimestampRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshRetriesRef = useRef<number>(0);

  const [sessionExpiryWarning, setSessionExpiryWarning] = useState(false);

  const performTokenRefresh = useCallback(async () => {
    if (refreshRetriesRef.current >= MAX_REFRESH_RETRIES) {
      await secureLogout();
      return;
    }

    const success = await refreshToken();
    if (success) {
      refreshRetriesRef.current = 0;
      lastActivityRef.current = Date.now();
    } else {
      refreshRetriesRef.current++;
      if (refreshRetriesRef.current >= MAX_REFRESH_RETRIES) {
        await secureLogout();
      }
    }
  }, [refreshToken, secureLogout]);

  const extendSession = useCallback(() => {
    setSessionExpiryWarning(false);
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    initialize();
    initializeExpress();
  }, [initialize, initializeExpress]);

  useEffect(() => {
    if (!isInitialized || !user) {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
      return;
    }

    inactivityTimerRef.current = setInterval(() => {
      const inactiveDuration = Date.now() - lastActivityRef.current;

      if (inactiveDuration >= INACTIVITY_TIMEOUT_MS) {
        secureLogout();
        setSessionExpiryWarning(false);
      } else if (inactiveDuration >= INACTIVITY_WARNING_MS && !sessionExpiryWarning) {
        setSessionExpiryWarning(true);
      }
    }, 30000);

    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [isInitialized, user, secureLogout, sessionExpiryWarning]);

  useEffect(() => {
    if (!isInitialized || !user) return;

    sessionCheckIntervalRef.current = setInterval(() => {
      validateCurrentSession().then((valid) => {
        if (!valid) {
          performTokenRefresh();
        }
      });
    }, SESSION_CHECK_INTERVAL_MS);

    return () => {
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    };
  }, [isInitialized, user, validateCurrentSession, performTokenRefresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        backgroundTimestampRef.current = Date.now();
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const bgTime = backgroundTimestampRef.current;
        if (bgTime && Date.now() - bgTime > APP_BACKGROUND_TIMEOUT_MS) {
          secureLogout();
        } else if (user) {
          validateCurrentSession();
          lastActivityRef.current = Date.now();
        }
        backgroundTimestampRef.current = null;
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [user, validateCurrentSession, secureLogout]);

  if (!isInitialized) {
    return (
      <View style={styles.loader}>
        <View style={styles.loaderContent}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>EPN</Text>
          </View>
          <ActivityIndicator size="large" color={T.primary} style={styles.spinner} />
          <Text style={styles.loaderSubtext}>EsfotGo</Text>
        </View>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && isSessionValid,
        isLoading,
        isSessionValid,
        sessionExpiryWarning,
        extendSession,
      }}
    >
      {children}

      <Modal
        visible={sessionExpiryWarning}
        transparent
        animationType="fade"
        onRequestClose={extendSession}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.modalOverlay}>
          <Animated.View entering={FadeIn.delay(100)} style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>⏰</Text>
            </View>
            <Text style={styles.modalTitle}>¿Sigues ahí?</Text>
            <Text style={styles.modalDescription}>
              Tu sesión está por expirar por inactividad. Toca &quot;Continuar&quot; para mantener tu sesión activa.
            </Text>
            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={extendSession}
              activeOpacity={0.8}
            >
              <Text style={styles.modalPrimaryButtonText}>Continuar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={() => {
                setSessionExpiryWarning(false);
                secureLogout();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalSecondaryButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.surface,
  },
  loaderContent: {
    alignItems: 'center',
    gap: Sizes.gapXl,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: T.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  logoText: {
    color: T.surface,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  spinner: {
    marginTop: 8,
  },
  loaderSubtext: {
    ...Typography.bodySm,
    color: T.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.paddingXl,
  },
  modalCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusXl,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 16,
    ...Shadows.lg,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.warningBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 32,
  },
  modalTitle: {
    ...Typography.h3,
    color: T.textPrimary,
    textAlign: 'center',
  },
  modalDescription: {
    ...Typography.body,
    color: T.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalPrimaryButton: {
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.paddingMd,
    width: '100%',
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    ...Typography.button,
    color: T.text,
  },
  modalSecondaryButton: {
    padding: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    ...Typography.body,
    color: T.textSecondary,
  },
});
