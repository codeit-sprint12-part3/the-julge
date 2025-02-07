import AuthGuard from "@/components/auth/AuthGuard";

function Page() {
  return <div className="">내 프로필 페이지</div>;
}

export default AuthGuard(Page, "employee");
