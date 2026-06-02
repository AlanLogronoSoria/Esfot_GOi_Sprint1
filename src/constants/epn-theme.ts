export const EPNColors = {
  primary: '#00205B',
  primaryLight: '#003380',
  primaryDark: '#001540',
  primaryFaded: '#E8EDF5',

  secondary: '#C8102E',
  secondaryLight: '#E81D3D',
  secondaryDark: '#A00D24',

  accent: '#FFB81C',
  accentLight: '#FFC94D',
  accentDark: '#D99A00',

  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#1B6BB0',
  infoLight: '#EFF6FF',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  white: '#FFFFFF',
  black: '#000000',

  background: '#F3F4F6',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#1B6BB0',

  border: '#E5E7EB',
  borderFocused: '#00205B',
  borderError: '#DC2626',

  inputBg: '#F9FAFB',
  inputPlaceholder: '#9CA3AF',

  tabBarActive: '#00205B',
  tabBarInactive: '#9CA3AF',
  tabBarBackground: '#FFFFFF',

  shadow: 'rgba(0, 0, 0, 0.08)',
} as const;

export const EPNTypography = {
  displayLarge: { fontSize: 34, fontWeight: '800' as const, lineHeight: 41, letterSpacing: -0.5 },
  displayMedium: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34, letterSpacing: -0.5 },
  titleLarge: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  titleMedium: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  titleSmall: { fontSize: 16, fontWeight: '700' as const, lineHeight: 22 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  labelLarge: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  labelMedium: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  labelSmall: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
} as const;

export const EPNSizes = {
  radiusXs: 6,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusFull: 9999,

  paddingXs: 4,
  paddingSm: 8,
  paddingMd: 14,
  paddingLg: 18,
  paddingXl: 24,

  gapXs: 4,
  gapSm: 8,
  gapMd: 14,
  gapLg: 20,
  gapXl: 28,

  iconSm: 18,
  iconMd: 24,
  iconLg: 32,

  buttonHeight: 52,
  inputHeight: 52,
  headerHeight: 220,
  tabBarHeight: 56,
} as const;

export const EPNShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export type EPNColor = keyof typeof EPNColors;
