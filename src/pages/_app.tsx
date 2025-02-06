import "@/styles/reset.css";
import "@/styles/globals.css";
import { ModalProvider } from "@/context/ModalContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/Toast.css";
import type { AppProps } from "next/app";

export { toast };

export default function App({ Component, pageProps }: AppProps) {
  const is404 = Component.displayName === "Error404Page";

  return (
    <ModalProvider>
      <div>
        {!is404 && <Header />}
        <main className="main-container">
          <Component {...pageProps} />
        </main>
        {!is404 && <Footer />}
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
