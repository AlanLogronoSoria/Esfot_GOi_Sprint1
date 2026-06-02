import React, { memo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, type ViewProps } from 'react-native';
import { DarkTheme as T, Shadows, Sizes, Typography, Glass } from '@/constants/design-system';

interface GlassCardProps extends ViewProps {
  variant?: 'default' | 'glow' | 'flat';
  intensity?: number;
}

export const GlassCard = memo(function GlassCard({ children, style, variant = 'default', ...props }: GlassCardProps) {
  return (
    <View style={[ss.base, ss[variant], ss.glassBg, style]} {...props}>
      {children}
    </View>
  );
});

interface GlassInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string;
  icon?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words';
  autoCorrect?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  rightElement?: React.ReactNode;
}

export const GlassInput = memo(function GlassInput({ placeholder, value, onChangeText, error, icon, secureTextEntry, keyboardType, autoCapitalize, autoCorrect, onFocus, onBlur, rightElement }: GlassInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[ss.inputWrap, focused && ss.inputFocused, error && ss.inputError]}>
      {icon && <Text style={ss.inputIcon}>{icon}</Text>}
      <TextInput
        style={ss.input}
        placeholder={placeholder}
        placeholderTextColor={T.inputPlaceholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onFocus={() => { setFocused(true); onFocus?.(); }}
        onBlur={() => { setFocused(false); onBlur?.(); }}
      />
      {rightElement}
    </View>
  );
});

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export const GlassButton = memo(function GlassButton({ title, onPress, variant = 'primary', disabled, loading, icon }: GlassButtonProps) {
  const btnStyle = variant === 'primary' ? ss.btnPrimary : variant === 'secondary' ? ss.btnSecondary : variant === 'outline' ? ss.btnOutline : ss.btnGhost;
  const textStyle = (variant === 'outline' || variant === 'ghost') ? ss.btnTextOutline : ss.btnText;
  return (
    <TouchableOpacity style={[ss.btn, btnStyle, disabled && ss.btnDisabled]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.85}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? T.primary : T.text} />
      ) : (
        <View style={ss.btnRow}>
          {icon && <Text style={ss.btnIcon}>{icon}</Text>}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

export const SectionHeader = memo(function SectionHeader({ title, action }: { title: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={ss.sectionHeader}>
      <Text style={ss.sectionTitle}>{title}</Text>
      {action && <TouchableOpacity onPress={action.onPress} activeOpacity={0.7}><Text style={ss.sectionAction}>{action.label}</Text></TouchableOpacity>}
    </View>
  );
});

export const Badge = memo(function Badge({ label, color = T.primary, variant = 'filled' }: { label: string; color?: string; variant?: 'filled' | 'outline' }) {
  return (
    <View style={[ss.badge, variant === 'outline' ? { borderWidth: 1, borderColor: color + '40' } : { backgroundColor: color + '20' }]}>
      <Text style={[ss.badgeText, { color }]}>{label}</Text>
    </View>
  );
});

const ss = StyleSheet.create({
  base: { borderRadius: Sizes.radiusLg, borderWidth: 1, borderColor: T.cardBorder, overflow: 'hidden' as const },
  glassBg: { backgroundColor: Glass.bg },
  default: { ...Shadows.md },
  glow: { ...Shadows.glow },
  flat: {},

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: T.inputBg,
    borderRadius: Sizes.radiusMd, borderWidth: 1.5, borderColor: T.inputBorder,
    height: Sizes.inputHeight, paddingHorizontal: Sizes.paddingMd,
  },
  inputFocused: { borderColor: T.inputBorderFocus, borderWidth: 1.5, backgroundColor: T.inputBg },
  inputError: { borderColor: T.error },
  input: { flex: 1, fontSize: 15, color: T.inputText, paddingVertical: 0 },
  inputIcon: { fontSize: 16, marginRight: 10 },

  btn: { height: Sizes.btnHeight, borderRadius: Sizes.radiusMd, justifyContent: 'center', alignItems: 'center' },
  btnPrimary: { backgroundColor: T.primary, ...Shadows.glow },
  btnSecondary: { backgroundColor: T.surface, borderWidth: 1, borderColor: T.cardBorder },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: T.primary },
  btnGhost: { backgroundColor: 'transparent' },
  btnDisabled: { opacity: 0.4 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnIcon: { fontSize: 18 },
  btnText: { ...Typography.button, color: T.text },
  btnTextOutline: { ...Typography.button, color: T.primary },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Sizes.paddingSm },
  sectionTitle: { ...Typography.h4, color: T.textPrimary },
  sectionAction: { ...Typography.caption, color: T.primary },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Sizes.radiusSm, alignSelf: 'flex-start' as const },
  badgeText: { ...Typography.caption, fontWeight: '700' as const },
});
