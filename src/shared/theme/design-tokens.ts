export const palette = {
  white: '#FFFFFF',
  black: '#0B0B0F',
  ink: '#11141A',
  inkSoft: '#3A3F4B',
  inkMuted: '#7A8194',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F6FA',
  surfaceMuted: '#EEF0F5',
  border: '#E2E5EC',
  primary: '#1F6FEB',
  primarySoft: '#E8F0FE',
  success: '#1A8754',
  warning: '#B26B00',
  warningSoft: '#FFF1D6',
  danger: '#D02E2E',
  dangerSoft: '#FDECEC',
  premium: '#7A4FD8',
  premiumSoft: '#EFE7FF',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export type ThemeColor = keyof typeof palette;
export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radii;
export type TypographyVariant = keyof typeof typography;