import { toast } from "@/pages/_app"; // ✅ _app.tsx에서 가져오기

const useToast = () => {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
    custom: (message: string, options = {}) => toast(message, options),
    raw: toast,
  };
};

export default useToast;
