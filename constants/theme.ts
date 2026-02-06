/**
 * Jimini Health Theme
 *
 * Brand colors extracted from jiminihealth.com
 * Uses emotion-based naming convention matching their design system
 */

import { Platform } from 'react-native';

/**
 * Jimini Health Brand Colors
 * Named after emotional states to align with mental health focus
 */
export const BrandColors = {
  // Primary action color - calming green for "safety"
  safety: '#7BC47F',
  safetyLight: '#A8D9AB',
  safetyDark: '#5AA65E',

  // Energetic/optimistic - lime yellow
  eager: '#F9FFAD',
  eagerDark: '#E5EB7A',
  eagerText: '#9A8200', // Darker amber for readable text

  // Primary brand blue
  calm: '#1451E2',
  calmLight: '#E6E6FF',

  // Secondary/accent purple
  apprehension: '#9B8AA6',
  apprehensionLight: '#C4B8CE',

  // Alert/warning states
  fear: '#681616',
  fearLight: '#8B3A3A',

  // Neutral backgrounds
  ivory: '#F2F0ED',
  ivoryDark: '#E5E2DE',

  // Text colors
  dark: '#242424',
  grey: '#919191',
  white: '#FFFFFF',
} as const;

// Primary tint colors derived from brand
const tintColorLight = BrandColors.safety;
const tintColorDark = BrandColors.safetyLight;

export const Colors = {
  light: {
    // Base colors
    text: BrandColors.dark,
    textSecondary: BrandColors.grey,
    background: BrandColors.ivory,
    backgroundSecondary: BrandColors.white,
    card: BrandColors.white,
    border: BrandColors.ivoryDark,

    // Brand colors
    tint: tintColorLight,
    primary: BrandColors.safety,
    primaryLight: BrandColors.safetyLight,
    secondary: BrandColors.calm,
    secondaryLight: BrandColors.calmLight,
    accent: BrandColors.apprehension,

    // Status colors
    success: BrandColors.safety,
    warning: BrandColors.eagerDark,
    error: BrandColors.fear,

    // Tab bar
    icon: BrandColors.grey,
    tabIconDefault: BrandColors.grey,
    tabIconSelected: tintColorLight,

    // Encounter status colors
    statusCompleted: BrandColors.safety,
    statusScheduled: BrandColors.calm,
    statusInProgress: BrandColors.eagerText,
    statusCancelled: BrandColors.grey,
    statusNoShow: BrandColors.fearLight,
  },
  dark: {
    // Base colors
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundSecondary: '#1E2022',
    card: '#242628',
    border: '#2E3134',

    // Brand colors (adjusted for dark mode)
    tint: tintColorDark,
    primary: BrandColors.safetyLight,
    primaryLight: BrandColors.safety,
    secondary: BrandColors.calmLight,
    secondaryLight: BrandColors.calm,
    accent: BrandColors.apprehensionLight,

    // Status colors
    success: BrandColors.safetyLight,
    warning: BrandColors.eager,
    error: '#E85454',

    // Tab bar
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Encounter status colors
    statusCompleted: BrandColors.safetyLight,
    statusScheduled: BrandColors.calmLight,
    statusInProgress: BrandColors.eagerDark,
    statusCancelled: '#9BA1A6',
    statusNoShow: '#E85454',
  },
} as const;

/**
 * Spacing scale (4px base unit)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border radius scale
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
