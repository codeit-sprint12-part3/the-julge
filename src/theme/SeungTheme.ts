import { createTheme } from "@mui/material/styles";

const SeungTheme = createTheme({
  palette: {
    success: {
      main: "#CCE6FF",
      light: "#CCE6FF",
      contrastText: "#fffff",
    },
    warning: {
      main: "#FFEBE7",
      light: "#FFEBE7",
      contrastText: "#fffff",
    },
    info: {
      main: "#D4F7D4",
      light: "#D4F7D4",
      contrastText: "#fffff",
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--blue-500)",
          color: "var(--white)",
          fontWeight: "bold",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "2px solid #ddd",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#1976d2",
          color: "#fff",
          fontWeight: "bold",
        },
        body: {
          fontSize: "14px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#f9f9f9",
          },
          "&:hover": {
            backgroundColor: "#e3f2fd",
          },
        },
      },
    },
  },
});

export default SeungTheme;
