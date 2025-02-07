import AuthGuard from "@/components/auth/AuthGuard";

function Page() {
  return <div className="">내 가게 등록 페이지</div>;
}

export default AuthGuard(Page, "employer");
