import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  LayoutAnimation, Platform, UIManager, Linking,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LightTheme as T, Sizes, Shadows, Typography } from '@/constants/design-system';
import { GlassHeader } from '@/components/ui/GlassHeader';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ─── FAQ Data ───
const FAQ_ITEMS = [
  {
    id: '1',
    question: '¿Cómo encuentro un aula en el mapa?',
    answer:
      'Ve a la pestaña "Mapa" en la barra inferior. Usa el buscador en la parte superior para escribir el código o nombre del aula. También puedes filtrar por categoría (Aula, Laboratorio, Oficina) usando los chips de filtro.',
  },
  {
    id: '2',
    question: '¿Cómo consulto los horarios del Polibus?',
    answer:
      'Dirígete a la pestaña "Polibus". Selecciona la ruta que deseas consultar y verás el recorrido en el mapa junto con las paradas y la información de cada una.',
  },
  {
    id: '3',
    question: '¿Puedo inscribirme en eventos desde la app?',
    answer:
      'Sí. En la sección "Eventos", abre el evento de tu interés y toca el botón "Inscribirse". Necesitas haber iniciado sesión con tu cuenta institucional.',
  },
  {
    id: '4',
    question: '¿Cómo agrego lugares a Favoritos?',
    answer:
      'Desde el Mapa, selecciona un edificio o aula y toca el ícono de estrella ⭐ en el panel de detalle. También puedes agregar rutas a favoritos desde la pantalla Polibus.',
  },
  {
    id: '5',
    question: '¿La aplicación funciona sin internet?',
    answer:
      'La aplicación requiere conexión a internet para mostrar el mapa, consultar eventos y horarios del Polibus. Sin embargo, tus favoritos y preferencias se almacenan localmente.',
  },
  {
    id: '6',
    question: '¿Cómo recupero mi contraseña?',
    answer:
      'En la pantalla de inicio de sesión, toca "¿Olvidaste tu contraseña?". Ingresa tu correo institucional y recibirás un enlace para restablecer tu contraseña.',
  },
  {
    id: '7',
    question: '¿Qué permisos necesita la aplicación?',
    answer:
      'ESFOT Go solicita permiso de ubicación para mostrar tu posición en el mapa y calcular rutas óptimas dentro del campus. Este permiso es opcional pero mejora significativamente la experiencia.',
  },
];

// ─── Accordion Item ───
function FaqItem({ item, isOpen, onToggle }: {
  item: typeof FAQ_ITEMS[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.faqItem, isOpen && styles.faqItemOpen]}
      onPress={onToggle}
      activeOpacity={0.85}
    >
      <View style={styles.faqHeader}>
        <View style={styles.faqQWrap}>
          <View style={[styles.faqDot, isOpen && styles.faqDotActive]} />
          <Text style={[styles.faqQuestion, isOpen && styles.faqQuestionActive]}>
            {item.question}
          </Text>
        </View>
        <Text style={[styles.faqChevron, isOpen && styles.faqChevronOpen]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </View>
      {isOpen && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Contact Card ───
function ContactCard({
  icon, label, value, onPress,
}: { icon: string; label: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.contactIconWrap}>
        <Text style={styles.contactIcon}>{icon}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={[styles.contactValue, onPress && styles.contactLink]}>
          {value}
        </Text>
      </View>
      {onPress && <Text style={styles.contactArrow}>›</Text>}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const toggleFaq = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFaq((prev) => (prev === id ? null : id));
  }, []);

  return (
    <View style={styles.root}>
      <GlassHeader
        scrollY={scrollY}
        onAvatarPress={() => router.push('/profile' as any)}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Ayuda</Text>
          <Text style={styles.subtitle}>
            Encuentra respuestas rápidas o contáctanos
          </Text>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>❓</Text>
            <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
          </View>
          {FAQ_ITEMS.map((item) => (
            <FaqItem
              key={item.id}
              item={item}
              isOpen={openFaq === item.id}
              onToggle={() => toggleFaq(item.id)}
            />
          ))}
        </Animated.View>

        {/* Contact Section */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📞</Text>
            <Text style={styles.sectionTitle}>Contacto institucional</Text>
          </View>
          <View style={styles.contactList}>
            <ContactCard
              icon="📧"
              label="Correo institucional"
              value="esfot@epn.edu.ec"
              onPress={() => Linking.openURL('mailto:esfot@epn.edu.ec')}
            />
            <ContactCard
              icon="📱"
              label="Teléfono"
              value="+593 2 2976 300 Ext. 2000"
              onPress={() => Linking.openURL('tel:+593229763002000')}
            />
            <ContactCard
              icon="📍"
              label="Dirección"
              value="Ladrón de Guevara E11-253, Quito, Ecuador"
            />
            <ContactCard
              icon="🕐"
              label="Horario de atención"
              value="Lunes a Viernes, 8:00 - 17:00"
            />
            <ContactCard
              icon="🌐"
              label="Sitio web institucional"
              value="www.epn.edu.ec"
              onPress={() => Linking.openURL('https://www.epn.edu.ec')}
            />
          </View>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🛠️</Text>
            <Text style={styles.sectionTitle}>Soporte técnico</Text>
          </View>
          <View style={styles.supportCard}>
            <Text style={styles.supportText}>
              ¿Encontraste un problema con la aplicación? Reporta el error y lo resolveremos lo antes posible.
            </Text>
            <TouchableOpacity
              style={styles.supportBtn}
              onPress={() => Linking.openURL('mailto:soporte.esfotgo@epn.edu.ec?subject=Reporte%20ESFOT%20Go')}
              activeOpacity={0.85}
            >
              <Text style={styles.supportBtnText}>✉️ Reportar un problema</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInDown.delay(320).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>ℹ️</Text>
            <Text style={styles.sectionTitle}>Acerca de ESFOT Go</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutLogo}>
              <Text style={styles.aboutLogoText}>EPN</Text>
            </View>
            <View style={styles.aboutInfo}>
              <Text style={styles.aboutAppName}>ESFOT Go</Text>
              <Text style={styles.aboutVersion}>Versión 1.0.0 · Sprint 1</Text>
              <Text style={styles.aboutOrg}>
                Escuela de Formación de Tecnólogos{'\n'}
                Escuela Politécnica Nacional
              </Text>
            </View>
          </View>
          <View style={styles.aboutMeta}>
            <Text style={styles.aboutMetaText}>
              Proyecto de titulación desarrollado para mejorar la experiencia de navegación y gestión del campus universitario ESFOT-EPN.
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.background },
  scroll: { flex: 1 },
  content: { paddingTop: 8 },

  header: {
    paddingHorizontal: Sizes.paddingMd,
    paddingTop: 72,
    paddingBottom: Sizes.gapSm,
    gap: 4,
  },
  title: { ...Typography.h2, color: T.textPrimary },
  subtitle: { ...Typography.body, color: T.textSecondary },

  section: {
    paddingHorizontal: Sizes.paddingMd,
    marginBottom: Sizes.gapXl,
    gap: Sizes.gapSm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionIcon: { fontSize: 20 },
  sectionTitle: {
    ...Typography.h4,
    color: T.textPrimary,
  },

  // FAQ
  faqItem: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    borderWidth: 1,
    borderColor: T.cardBorder,
    marginBottom: Sizes.gapSm,
    ...Shadows.sm,
  },
  faqItemOpen: {
    borderColor: T.primary,
    backgroundColor: T.backgroundCard,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  faqQWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  faqDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.neutral,
    marginTop: 5,
    flexShrink: 0,
  },
  faqDotActive: { backgroundColor: T.primary },
  faqQuestion: {
    ...Typography.bodySm,
    color: T.textPrimary,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  faqQuestionActive: { color: T.primary },
  faqChevron: {
    fontSize: 10,
    color: T.textTertiary,
    marginTop: 4,
  },
  faqChevronOpen: { color: T.primary },
  faqAnswer: {
    ...Typography.bodySm,
    color: T.textSecondary,
    lineHeight: 20,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.divider,
  },

  // Contact
  contactList: { gap: Sizes.gapSm },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingMd,
    gap: 12,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  contactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactIcon: { fontSize: 20 },
  contactInfo: { flex: 1 },
  contactLabel: {
    fontSize: 11,
    color: T.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: { ...Typography.bodySm, color: T.textPrimary, fontWeight: '500' },
  contactLink: { color: T.primary, textDecorationLine: 'underline' },
  contactArrow: { fontSize: 20, color: T.textTertiary },

  // Support
  supportCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingLg,
    gap: Sizes.gapMd,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  supportText: { ...Typography.bodySm, color: T.textSecondary, lineHeight: 20 },
  supportBtn: {
    backgroundColor: T.primary,
    borderRadius: Sizes.radiusMd,
    paddingVertical: 13,
    alignItems: 'center',
  },
  supportBtnText: { ...Typography.button, color: '#FFFFFF', fontSize: 14 },

  // About
  aboutCard: {
    backgroundColor: T.surface,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.paddingLg,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...Shadows.sm,
  },
  aboutLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutLogoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  aboutInfo: { flex: 1, gap: 3 },
  aboutAppName: { ...Typography.h4, color: T.textPrimary },
  aboutVersion: { fontSize: 11, color: T.textTertiary },
  aboutOrg: { fontSize: 12, color: T.textSecondary, lineHeight: 17 },
  aboutMeta: {
    backgroundColor: T.primaryMuted,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.paddingMd,
  },
  aboutMetaText: { ...Typography.bodySm, color: T.primary, lineHeight: 19 },
});
