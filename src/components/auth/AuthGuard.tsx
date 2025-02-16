import { useAuthUser } from "@/stores/useAuthUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

const AuthGuard = (Component: any, requiredType?: "employer" | "employee") => {
  return function WrappedComponent(props: any) {
    const { token, user, fetchAndSetUser } = useAuthUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetched, setIsFetched] = useState(false); // 유저 정보가 정상적으로 받아졌는지 여부

    useEffect(() => {
      if (!token) {
        router.replace("/auth/login");
      } else {
        fetchAndSetUser().then(() => {
          setIsFetched(true); // 유저 정보가 업데이트됨
        });
      }
    }, [token, fetchAndSetUser, router]);

    useEffect(() => {
      if (isFetched) {
        if (!token && !user) {
          router.replace("/");
        } else if (requiredType && user?.type !== requiredType) {
          router.replace("/403");
        } else {
          setIsLoading(false);
        }
      }
    }, [isFetched, user, requiredType, router]);

    if (isLoading || !isFetched) return <SpinnerLoader />; // 유저 정보가 로드될 때까지 로딩 UI 표시
    return <Component {...props} />;
  };
};

export default AuthGuard;
