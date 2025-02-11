import { useAuthUser } from "@/stores/useAuthUser";
import AuthGuard from "@/components/auth/AuthGuard";
import EmptyState from "@/components/ui/EmptyState";
import Title from "@/components/ui/Title";
import { useState, useEffect } from "react";
import { getUserApplications } from "@/lib/applications";
import Profile from "@/components/user/Profile";
import style from "@/pages/user/index.module.css";
import Application from "@/components/user/Application";

function Page() {
  const { token, user, fetchAndSetUser } = useAuthUser();
  const [isHistory, setIsHistory] = useState<boolean | null>(null);
  const isProfile = user?.name && user?.phone;
  const [detailData, setDetailData] = useState<any[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      try {
        const response = await getUserApplications(user.id);
        setIsHistory(response.count !== 0);

        const cleanedData = response.items.map((app: any) => ({
          id: app.item.id,
          status: app.item.status,
          createdAt: app.item.createdAt,
          shop: app.item.shop.item,
          notice: app.item.notice.item,
        }));

        setDetailData(cleanedData);
      } catch (error) {
        console.error("지원내역:", error);
      }
    };

    fetchApplications();
  }, [token, user, fetchAndSetUser]);

  return (
    <div className={style["user-wrapper"]}>
      <section className={isProfile ? style["is-profile"] : ""}>
        <Title text="내 프로필" />
        {isProfile ? (
          <Profile userInfo={user} />
        ) : (
          <EmptyState
            message={"내 프로필을 등록하고 원하는 가게에 지원해 보세요."}
            buttonText={"내 프로필 등록하기"}
            href={"/user/edit"}
          />
        )}
      </section>
      <section className={style["history-section"]}>
        <Title text="신청 내역" />
        {isHistory ? (
          <Application data={detailData} />
        ) : (
          <EmptyState
            message={"아직 신청 내역이 없어요."}
            buttonText={"공고 보러가기"}
            href={"/"}
          />
        )}
      </section>
    </div>
  );
}

export default AuthGuard(Page, "employee");
