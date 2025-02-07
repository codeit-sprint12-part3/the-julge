import "@/styles/reset.css";
import "@/styles/globals.css";
import { ModalProvider } from "@/context/ModalContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/Toast.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export { toast };

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);

    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const noLayout = ["/auth/signup", "/auth/login", "/404", "/403"].includes(router.pathname);

  return (
    <ModalProvider>
      {loading && <SkeletonLoader />}
      <div style={{ overflow: "Hidden", display: loading ? "none" : "block" }}>
        {!noLayout && <Header />}
        <main className={noLayout ? "" : "main-container"}>
          <Component {...pageProps} />
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
