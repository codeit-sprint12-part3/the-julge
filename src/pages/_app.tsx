import "@/styles/reset.css";
import "@/styles/globals.css";
import { ModalProvider } from "@/context/ModalContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const is404 = Component.displayName === "Error404Page";

  return (
    <ModalProvider>
      <div>
        {!is404 && <Header />}
        <main>
          <Component {...pageProps} />
        </main>
        {!is404 && <Footer />}
      </div>
    </ModalProvider>
  );
}
