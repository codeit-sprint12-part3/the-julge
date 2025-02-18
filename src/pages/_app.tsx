import "@/styles/reset.css";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { ModalProvider } from "@/context/ModalContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/Toast.css";
import Top from "@/components/ui/Top";

export { toast };

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noLayout = ["/auth/signup", "/auth/login", "/404", "/403"].includes(router.pathname);

  return (
    <ModalProvider>
      <div style={{ overflow: "Hidden" }}>
        {!noLayout && <Header />}
        <main className={noLayout ? "" : "main-container"}>
          <Component {...pageProps} />
          <Top />
        </main>
        {!noLayout && <Footer />}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </ModalProvider>
  );
}
