export const lightTheme = {
  colors: {
    primary: '#185FA5', // Primary Blue
    secondary: '#378ADD', // Funnel Mid

    background: '#F5F7FA', // Page BG
    card: '#FFFFFF', // Card / Sidebar
    inputBg: '#F9FAFB', // Input BG
    hover: '#F3F4F6', // Hover / Grid Line
    activeNav: '#EFF6FF', // Active Nav / Check

    border: '#E4E7EC',
    inputFocus: '#93C5FD',

    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280',
      hint: '#9CA3AF',
    },

    blue: {
      primary: '#185FA5',
      light: '#60A5FA',
      surface: '#DBEAFE',
      avatarText: '#1E40AF',
      avatarBg: '#DBEAFE',
      funnel: '#93C5FD',
      donutReturn: '#BFDBFE',
      button: '#185FA5',
      logo: '#1E40AF',
    },

    semantic: {
      success: '#059669',
      successBg: '#ECFDF5',
      warning: '#D97706',
      warningBg: '#FFFBEB',
      danger: '#DC2626',
      dangerBg: '#FEF2F2',
    },

    info: '#61dafb', // 기존 유지 (명세 없음이라 보존)
    white: '#ffffff',
    black: '#000000',
  },

  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },

  fontWeights: {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },

  spacing: {
    s0: '0px',
    s1: '4px',
    s2: '8px',
    s3: '12px',
    s4: '16px',
    s5: '20px',
    s6: '24px',
    s8: '32px',
    s10: '40px',
    s12: '48px',
    s16: '64px',
    s20: '80px',
    s24: '96px',
    s32: '128px',
    s40: '160px',
    s48: '192px',
    s56: '224px',
    s64: '256px',
    buttonPadding: '15px 20px',
  },

  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },

  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  fontFamily: {
    primary: 'Godo B',
    secondary: 'Paperlogy',
  },

  widthes: {
    layoutWidth: '1280px',
    maxWidth: '1920px',
    input: '200px',
  },

  heightes: {
    input: '36px',
  },
};

export const darkTheme = {
  colors: {
    primary: '#58A6FF', // Primary Blue
    secondary: '#378ADD', // Chart Line

    background: '#0D1117', // Page BG
    card: '#161B22', // Sidebar / Card
    cardSurface: '#1C2333', // Card Surface
    inputBg: '#21262D', // Input / Hover
    hover: '#21262D',
    activeNav: '#0C2D52', // Active Nav BG
    inputFocus: '#58A6FF',

    border: '#30363D',
    borderActive: '#1D4ED8',

    text: {
      primary: '#E6EDF3',
      secondary: '#C9D1D9',
      muted: '#8B949E',
      hint: '#6E7681',
    },

    blue: {
      primary: '#58A6FF',
      light: '#60A5FA',
      surface: '#0C2D52',
      avatarText: '#E6F1FB',
      avatarBg: '#0C2D52',
      funnel: '#93C5FD',
      donutReturn: '#B5D4F4',
      button: '#1D4ED8',
      logo: '#E6F1FB',
    },

    semantic: {
      success: '#3FB950',
      successBg: '#1D2D1E',
      warning: '#D29922',
      warningBg: '#2D2208',
      danger: '#F85149',
      dangerBg: '#2D1212',
    },

    white: '#ffffff',
    black: '#000000',
  },

  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },

  fontWeights: {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },

  spacing: {
    s0: '0px',
    s1: '4px',
    s2: '8px',
    s3: '12px',
    s4: '16px',
    s5: '20px',
    s6: '24px',
    s8: '32px',
    s10: '40px',
    s12: '48px',
    s16: '64px',
    s20: '80px',
    s24: '96px',
    s32: '128px',
    s40: '160px',
    s48: '192px',
    s56: '224px',
    s64: '256px',
    buttonPadding: '15px 20px',
  },

  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.6)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.7)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.8)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
    none: 'none',
  },

  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  fontFamily: {
    primary: 'Godo B',
    secondary: 'Paperlogy',
  },

  widthes: {
    layoutWidth: '1280px',
    maxWidth: '1920px',
    input: '200px',
  },

  heightes: {
    input: '36px',
  },
};
