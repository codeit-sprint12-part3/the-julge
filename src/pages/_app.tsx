import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "@/styles/reset.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
