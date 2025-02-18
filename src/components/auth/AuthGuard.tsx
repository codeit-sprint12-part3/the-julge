import { useAuthUser } from "@/stores/useAuthUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthGuard = (Component: any, requiredType?: "employer" | "employee") => {
  return function WrappedComponent(props: any) {
    const { token, user, fetchAndSetUser } = useAuthUser();
    const router = useRouter();
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
      if (!token) {
        router.replace("/auth/login");
      } else {
        fetchAndSetUser().then(() => {
          setIsFetched(true);
        });
      }
    }, [token, fetchAndSetUser, router]);

    useEffect(() => {
      if (isFetched) {
        if (!token && !user) {
          router.replace("/");
        }

        if (requiredType && user?.type !== requiredType) {
          router.replace("/403");
        }
      }
    }, [isFetched, user, requiredType, router]);

    return <Component {...props} />;
  };
};

export default AuthGuard;
