import { createTheme } from '@mui/material/styles';

export const createMuiTheme = (modeTheme) => {
  return createTheme({
    palette: {
      // =====================
      // 🎯 Core Colors
      // =====================
      primary: {
        main: modeTheme.colors.secondary,
      },
      secondary: {
        main: modeTheme.colors.secondary,
      },
      error: {
        main: modeTheme.colors.error || modeTheme.colors.danger,
      },
      warning: {
        main: modeTheme.colors.warning,
      },
      info: {
        main: modeTheme.colors.info,
      },
      success: {
        main: modeTheme.colors.semantic?.success || modeTheme.colors.success,
      },
      // =====================
      // 🎯 Text (TypeText)
      // =====================
      text: {
        primary: modeTheme.colors.text?.primary,
        secondary: modeTheme.colors.text?.secondary,
        disabled: modeTheme.colors.text?.muted,
      },

      // =====================
      // 🎯 Background (TypeBackground)
      // =====================
      background: {
        default: modeTheme.colors.background,
        paper: modeTheme.colors.card || modeTheme.colors.background,
      },
      // =====================
      // 🎯 Action (hover, active 등)
      // =====================
      action: {
        hover: modeTheme.colors.hover,
        selected: modeTheme.colors.activeNav,
        disabled: modeTheme.colors.gray?.[400],
      },
      // =====================
      // 🎯 Divider
      // =====================
      divider: modeTheme.colors.border,
      border: modeTheme.colors.border,
    },
    components:{
        MuiStat:{
            styleOverrides:{
                root:{
                    background: '#FFFFFF',
                }
            },
            defaultProps: {
                variant: 'outlined',
            },
        }
    },
    // =====================
    // 🎯 Typography
    // =====================
    typography: {
      fontFamily: modeTheme.fontFamily?.primary || 'Roboto',
      fontSize: parseInt(modeTheme.fontSizes?.base || '16px'),
      h1: { fontSize: modeTheme.fontSizes?.['5xl'] },
      h2: { fontSize: modeTheme.fontSizes?.['4xl'] },
      h3: { fontSize: modeTheme.fontSizes?.['3xl'] },
      h4: { fontSize: modeTheme.fontSizes?.['2xl'] },
      h5: { fontSize: modeTheme.fontSizes?.xl },
      h6: { fontSize: modeTheme.fontSizes?.lg },
      body1: { fontSize: modeTheme.fontSizes?.base },
      body2: { fontSize: modeTheme.fontSizes?.sm },
    },

    // =====================
    // 🎯 Shape (border radius)
    // =====================
    shape: {
      borderRadius: parseInt(modeTheme.borderRadius?.base || '4px'),
    },

    // =====================
    // 🎯 Shadows
    // =====================
    shadows: modeTheme.shadows,

    // =====================
    // 🎯 Spacing
    // =====================
    spacing: (factor) => factor * 8,
  });
};