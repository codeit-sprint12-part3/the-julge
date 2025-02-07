import AuthGuard from "@/components/auth/AuthGuard";
import { useRouter } from "next/router";

function Page() {
  const router = useRouter();
  const { id } = router.query;
  return <div>내 가게 - {id}번 공고 상세 페이지</div>;
}
export default AuthGuard(Page, "employer");
