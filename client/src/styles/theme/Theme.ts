import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const colors = {
  white: "#fbfdff",
  blue: "#82bfd4",
  black: "#2c3237",
  brown: "#72797f",
  gray: "#bdd1d9",

  blackPrimary: "#395266",
  grayPrimary: "#C9DBEA",
  whitePrimary: "#F0F2F2",
  darkBluePrimary: "#6FBFBF",
  bluePrimary: "#395266",

  red: "#f44336",
  green: "#009688",
  orange: "#ff9800",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.blue,
      // main: "#00b8d4",
      contrastText: colors.white,
    },
    secondary: {
      main: colors.gray,
    },
  },
});
