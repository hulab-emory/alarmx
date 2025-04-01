import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.30),
    alpha50: alpha(color.main, 0.50)
  };
};

const neutral = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#1C2536',
  900: '#111927'
};

const primary = withAlphas({
  main: '#009be5',
  contrastText: '#fff',
});

const secondary = withAlphas({
  main: '#f57c00',
  contrastText: '#fff',
}); 

const success = withAlphas({
  lightest: '#F0FDF9',
  light: '#3FC79A',
  main: '#10B981',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF'
});

const info = withAlphas({
  lightest: '#ECFDFF',
  light: '#CFF9FE',
  main: '#06AED4',
  dark: '#0E7090',
  darkest: '#164C63',
  contrastText: '#FFFFFF'
});

const warning = withAlphas({
  lightest: '#FFFAEB',
  light: '#FEF0C7',
  main: '#F79009',
  dark: '#B54708',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF'
});

const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#F04438',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF'
});

const palette = {
  common: { black: "#000", white: "#fff" },
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  custom: {
    light: "#ffa726",
    main: "#f57c00",
    dark: "#ef6c00",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  grey: neutral,
  divider: alpha(neutral[500], 0.2),
  text: {
    primary: neutral[800],
    secondary: neutral[600],
    disabled: neutral[400],
  },
  background: {
    paper: "#fff",
    default: neutral[100],
    neutral: neutral[200],
  },
  action: {
    active: neutral[500],
    disabled: alpha(neutral[900], 0.38),
    disabledBackground: alpha(neutral[900], 0.12),
    focus: alpha(neutral[900], 0.16),
    hover: alpha(neutral[900], 0.04),
    selected: alpha(neutral[900], 0.12)
  },
};

export default palette;
