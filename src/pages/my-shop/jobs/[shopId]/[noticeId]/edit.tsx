import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { shopId, noticeId } = router.query;
  return (
    <div>
      내 {shopId} 가게 - {noticeId}번 공고 편집 페이지
    </div>
  );
}
