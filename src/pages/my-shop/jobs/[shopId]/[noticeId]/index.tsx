import AuthGuard from "@/components/auth/AuthGuard";
import Head from "next/head";
import styles from "./jobs.module.css";
import DetailTopBox from "@/components/ui/DetailTopBox";
import ApplicantsTable from "@/components/ui/ApplicantsTable";
import { useEffect, useState } from "react";
import { NoticeWrapper } from "@/type";
import router from "next/router";
import { getShopNotice } from "@/lib/notices";

function Page() {
  const { shopId, noticeId } = router.query;
  const [postData, setPostData] = useState<NoticeWrapper>();

  // 공고 데이터 불러오기 [시작]
  useEffect(() => {
    const fetchData = async () => {
      if (!shopId || !noticeId) return;
      try {
        const data = await getShopNotice(shopId as string, noticeId as string);
        setPostData(data);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };
    fetchData();
  }, [shopId, noticeId]);
  // 공고 데이터 불러오기 [종료]

  return (
    <>
      <Head>
        <title>{postData?.item.shop.item.name}</title>
        <meta name="description" content={postData?.item.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={postData?.item.shop.item.imageUrl} />
        <meta property="og:title" content={postData?.item.shop.item.name} />
      </Head>
      <div className={styles.view}>
        <DetailTopBox />
        <ApplicantsTable />
      </div>
    </>
  );
}
export default AuthGuard(Page, "employer");
