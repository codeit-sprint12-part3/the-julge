import MyshopRegInfo from "@/components/my-shop/MyshopRegInfo";
import Title from "@/components/ui/Title";
import style from "@/pages/my-shop/Myshop.module.css";
import { useAuthUser } from "@/stores/useAuthUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserInfo } from "@/lib/users";
import AuthGuard from "@/components/auth/AuthGuard";

function Page() {
  const { token, user, fetchAndSetUser } = useAuthUser();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // 사용자 정보가 없다면 API로 가져오기
    const fetchUserInfoIfNeeded = () => {
      if (!user && token) {
        const fetchUserInfo = async () => {
          try {
            const userData = await getUserInfo();  // API에서 사용자 정보 가져오기
            // fetchAndSetUser(userData);  // 오류가 나므로 인자를 전달하지 않음
            fetchAndSetUser();  // 상태 업데이트 함수 호출 (매개변수 없이)
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
        };
        fetchUserInfo();
      }
    };

    fetchUserInfoIfNeeded();  // 비동기 처리 호출
  }, [token, user, fetchAndSetUser]);

  useEffect(() => {
    if (user && user.shop && user.shop.href) {
      const shopHref = user.shop.href;

      if (shopHref.startsWith("/api/")) {
        const shopId = shopHref.split("/").pop();
        if (shopId) {
          // query를 Record 타입으로 설정
          router.push({
            pathname: "/my-shop/detail",  // 상세 페이지로 이동
            query: { shopId: shopId } as Record<string, string>,  // 타입 강제 지정
          });
        }
      }
    }
  }, [user, router]);

  return (
    <div className={style.myshopContainer}>
      <Title text="내 가게" />
      <MyshopRegInfo
        infoText="내 가게를 소개하고 공고도 등록해 보세요."
        buttonText="가게 등록하기"
        href="/my-shop/write"
      />
    </div>
  );
}

export default AuthGuard(Page, "employer");