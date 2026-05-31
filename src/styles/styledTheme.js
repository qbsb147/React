export const createStyledTheme = (modeTheme) => {
  return {
    colors: modeTheme.colors,

    fontSizes: modeTheme.fontSizes,
    fontWeights: modeTheme.fontWeights,

    breakpoints: modeTheme.breakpoints,
    spacing: modeTheme.spacing,

    borderRadius: modeTheme.borderRadius,
    shadows: modeTheme.shadows,

    zIndices: modeTheme.zIndices,

    fontFamily: modeTheme.fontFamily,
    widthes: modeTheme.widthes,
    heightes: modeTheme.heightes,
  };
}