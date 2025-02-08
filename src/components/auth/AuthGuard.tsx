import { useAuthUser } from "@/stores/useAuthUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

const AuthGuard = (Component: any, requiredType?: "employer" | "employee") => {
  return function WrappedComponent(props: any) {
    const { token, user, fetchAndSetUser } = useAuthUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!token) {
        router.replace("/auth/login");
      } else {
        fetchAndSetUser().then(() => {
          if (requiredType && user?.type !== requiredType) {
            router.replace("/403");
          } else {
            setIsLoading(false);
          }
        });
      }
    }, [token, user, router, fetchAndSetUser]);

    if (isLoading) return <SpinnerLoader />; // 로딩 중일 때 Skeleton UI 표시
    return <Component {...props} />;
  };
};

export default AuthGuard;
