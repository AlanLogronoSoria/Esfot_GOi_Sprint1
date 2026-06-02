export const DarkTheme = {
  primary: '#0033A0',
  primaryLight: '#1A5BCF',
  primaryMuted: 'rgba(0,51,160,0.25)',
  primaryGlow: 'rgba(0,51,160,0.5)',

  accent: '#FFB81C',
  accentLight: '#FFD166',
  accentMuted: 'rgba(255,184,28,0.15)',

  background: '#0D0D0F',
  backgroundElevated: '#141416',
  backgroundCard: '#1A1A1E',

  surface: '#1C1C1E',
  surfaceGlass: 'rgba(28,28,30,0.75)',
  surfaceBorder: 'rgba(255,255,255,0.06)',

  text: '#FFFFFF',
  textPrimary: '#F5F5F7',
  textSecondary: '#98989E',
  textTertiary: '#636369',
  textMuted: '#48484E',

  success: '#30D158',
  successBg: 'rgba(48,209,88,0.12)',
  warning: '#FFD60A',
  warningBg: 'rgba(255,214,10,0.12)',
  error: '#FF453A',
  errorBg: 'rgba(255,69,58,0.12)',
  info: '#64D2FF',
  infoBg: 'rgba(100,210,255,0.12)',

  inputBg: '#1C1C1E',
  inputBorder: 'rgba(255,255,255,0.08)',
  inputBorderFocus: 'rgba(0,51,160,0.6)',
  inputPlaceholder: '#636369',
  inputText: '#F5F5F7',

  tabBarBg: 'rgba(13,13,15,0.85)',
  tabBarBorder: 'rgba(255,255,255,0.04)',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#636369',

  cardBorder: 'rgba(255,255,255,0.06)',
  divider: 'rgba(255,255,255,0.05)',
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: '#0033A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const Sizes = {
  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 18,
  radiusXl: 24,
  radiusFull: 999,

  paddingXs: 6,
  paddingSm: 10,
  paddingMd: 16,
  paddingLg: 20,
  paddingXl: 24,

  gapXs: 4,
  gapSm: 8,
  gapMd: 14,
  gapLg: 20,
  gapXl: 28,

  iconSm: 18,
  iconMd: 24,
  iconLg: 32,

  btnHeight: 54,
  inputHeight: 54,

  headerH: 220,
  tabH: 60,
} as const;

export const Typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h4: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySm: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  button: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 0.3 },
} as const;

export const Glass = {
  bg: 'rgba(28,28,30,0.75)',
  border: 'rgba(255,255,255,0.06)',
  backdrop: 'rgba(13,13,15,0.5)',
} as const;

export const EPN_GOLD = '#FFB81C';
export const EPN_BLUE = '#0033A0';
export const EPN_WHITE = '#F5F5F7';

// ─── Institutional Light Theme ───

export const LightTheme = {
  primary: '#042c5c',
  primaryLight: '#1a4a8a',
  primaryMuted: 'rgba(4,44,92,0.10)',
  primaryGlow: 'rgba(4,44,92,0.18)',

  accent: '#eb2f26',
  accentLight: '#ef5a52',
  accentMuted: 'rgba(235,47,38,0.10)',

  highlight: '#fabb54',
  highlightLight: '#fcca77',
  highlightMuted: 'rgba(250,187,84,0.15)',

  neutral: '#827372',
  neutralLight: '#a39493',
  neutralMuted: 'rgba(130,115,114,0.10)',

  background: '#F8FAFC',
  backgroundElevated: '#FFFFFF',
  backgroundCard: '#FFFFFF',

  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255,255,255,0.80)',
  surfaceBorder: 'rgba(0,0,0,0.06)',

  text: '#0b1c30',
  textPrimary: '#0b1c30',
  textSecondary: '#827372',
  textTertiary: '#a39493',
  textMuted: '#c4bfbe',

  success: '#059669',
  successBg: 'rgba(5,150,105,0.10)',
  warning: '#fabb54',
  warningBg: 'rgba(250,187,84,0.12)',
  error: '#eb2f26',
  errorBg: 'rgba(235,47,38,0.08)',
  info: '#042c5c',
  infoBg: 'rgba(4,44,92,0.08)',

  inputBg: '#F1F5F9',
  inputBorder: 'rgba(0,0,0,0.10)',
  inputBorderFocus: 'rgba(4,44,92,0.40)',
  inputPlaceholder: '#a39493',
  inputText: '#0b1c30',

  tabBarBg: 'rgba(248,250,252,0.92)',
  tabBarBorder: 'rgba(0,0,0,0.06)',
  tabBarActive: '#042c5c',
  tabBarInactive: '#827372',

  cardBorder: 'rgba(0,0,0,0.06)',
  divider: 'rgba(0,0,0,0.05)',
} as const;
