import AuthGuard from "@/components/auth/AuthGuard";
import EmptyState from "@/components/ui/EmptyState";
import Title from "@/components/ui/Title";

function Page() {
  return (
    <>
      <section>
        <Title text="내 프로필" />
        <EmptyState
          message={"내 프로필을 등록하고 원하는 가게에 지원해 보세요."}
          buttonText={"내 프로필 등록하기"}
          href={"/user/write"}
        />
      </section>
      <section>
        <Title text="신청 내역" />
      </section>
    </>
  );
}

export default AuthGuard(Page, "employee");
