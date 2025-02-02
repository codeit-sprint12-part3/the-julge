import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  return <div>내 가게 - {id}번 공고 상세 페이지</div>;
}
