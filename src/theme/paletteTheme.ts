import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    red: {
      100: string;
      200: string;
      300: string;
      400: string;
    };
    blue: {
      100: string;
      200: string;
    };
    green: {
      100: string;
      200: string;
    };
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
    };
    kakao: {
      main: string;
    };
  }

  interface PaletteOptions {
    red?: {
      100: string;
      200: string;
      300: string;
      400: string;
    };
    blue?: {
      100: string;
      200: string;
    };
    green?: {
      100: string;
      200: string;
    };
    gray?: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
    };
    kakao?: {
      main: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#ea3c12", // 주 색상
    },
    secondary: {
      main: "#ff8d72", // 서브 색상
    },
    text: {
      primary: "#111322", // 기본 텍스트 색상
      secondary: "#7d7986", // 보조 텍스트 색상
      disabled: "#cbc9cf", // 비활성화된 텍스트 색상
    },
    background: {
      default: "#fafafa", // 전체 배경색
      paper: "#ffffff", // 카드, 박스 배경색
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
    red: {
      100: "#ffebe7",
      200: "#ffaf9b",
      300: "#ff8d72",
      400: "#ff4040",
    },
    blue: {
      100: "#cce6ff",
      200: "#0080ff",
    },
    green: {
      100: "#d4f7d4",
      200: "#20a81e",
    },
    gray: {
      100: "#fafafa",
      200: "#f2f2f3",
      300: "#e5e4e7",
      400: "#cbc9cf",
      500: "#a4a1aa",
      600: "#7d7986",
    },
    kakao: {
      main: "#fee500",
    },
  },
});

export default theme;
