export const colors = {
  primary: {
    main: '#6366F1',
    light: '#818CF8',
    dark: '#4F46E5',
    gradient: ['#6366F1', '#8B5CF6'],
  },
  secondary: {
    main: '#EC4899',
    light: '#F472B6',
    dark: '#DB2777',
    gradient: ['#EC4899', '#F472B6'],
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    gradient: ['#10B981', '#34D399'],
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
    gradient: ['#F59E0B', '#FCD34D'],
  },
  danger: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    gradient: ['#EF4444', '#F87171'],
  },
  neutral: {
    white: '#FFFFFF',
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
    black: '#000000',
  },
  background: {
    primary: '#F9FAFB',
    secondary: '#FFFFFF',
    elevated: '#FFFFFF',
    gradient: ['#F9FAFB', '#F3F4F6'],
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  workoutTypes: {
    upperBody: {
      main: '#3B82F6',
      light: '#60A5FA',
      gradient: ['#3B82F6', '#60A5FA'],
    },
    lowerBody: {
      main: '#10B981',
      light: '#34D399',
      gradient: ['#10B981', '#34D399'],
    },
    core: {
      main: '#F59E0B',
      light: '#FCD34D',
      gradient: ['#F59E0B', '#FCD34D'],
    },
    cardio: {
      main: '#EF4444',
      light: '#F87171',
      gradient: ['#EF4444', '#F87171'],
    },
    class: {
      main: '#8B5CF6',
      light: '#A78BFA',
      gradient: ['#8B5CF6', '#A78BFA'],
    },
    activity: {
      main: '#EC4899',
      light: '#F472B6',
      gradient: ['#EC4899', '#F472B6'],
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};