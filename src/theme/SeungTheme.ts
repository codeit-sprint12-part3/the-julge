import { createTheme } from "@mui/material/styles";

const SeungTheme = createTheme({
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f2f2f2",
          margin: "15px",
        },
      },
    },
  },
});

export default SeungTheme;
