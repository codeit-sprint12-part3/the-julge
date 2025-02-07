import { useAuthUser } from "@/stores/useAuthUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthGuard = (Component: any, requiredType?: "employer" | "employee") => {
  return function WrappedComponent(props: any) {
    const { token, user } = useAuthUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!token) {
        router.replace("/auth/login");
      } else if (requiredType && user?.type !== requiredType) {
        router.replace("/403");
      } else {
        setIsLoading(false);
      }
    }, [token, user, router]);

    if (isLoading) return null; // 로딩 중일 때 빈 화면 표시
    return <Component {...props} />;
  };
};

export default AuthGuard;
