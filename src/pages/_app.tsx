import "@/styles/reset.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import basicTheme from "@/theme/basicTheme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={basicTheme}>
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
