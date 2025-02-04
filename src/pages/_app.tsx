import "@/styles/reset.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import paletteTheme from "@/theme/paletteTheme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={paletteTheme}>
      <div>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
