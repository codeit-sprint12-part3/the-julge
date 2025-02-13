import { useEffect, useState } from "react";
import styles from "./view.module.css";
import { NoticeWrapper } from "@/type";
import Title from "@/components/ui/Title";
import PostCard from "@/components/ui/PostCard";
import Head from "next/head";
import DetailTopBox from "@/components/ui/DetailTopBox";
import { useRouter } from "next/router";
import { getShopNotice } from "@/lib/notices";

const ViewPage = () => {
  const [postData, setPostData] = useState<NoticeWrapper>();
  const [recentPosts, setRecentPosts] = useState<NoticeWrapper[]>([]);
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [noticeId, setNoticeId] = useState<string | null>(null);

  // 공고 데이터 불러오기 [시작]
  useEffect(() => {
    if (router.isReady) {
      setShopId((router.query.shopId as string) ?? null);
      setNoticeId((router.query.noticeId as string) ?? null);
    }
  }, [router.isReady, router.query.shopId, router.query.noticeId]);

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

  // 로컬스토리지에서 최근에 본 공고 불러오기 [시작]
  useEffect(() => {
    const storedPosts: NoticeWrapper[] = JSON.parse(localStorage.getItem("recentPosts") || "[]");
    setRecentPosts(storedPosts);
  }, []);

  useEffect(() => {
    if (!postData) return;

    setRecentPosts((prev) => {
      const updatedPosts: NoticeWrapper[] = [
        postData,
        ...prev.filter((post) => post.item.id !== postData.item.id),
      ].slice(0, 6);
      localStorage.setItem("recentPosts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  }, [postData]);
  // 로컬스토리지에서 최근에 본 공고 불러오기 [종료]

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
        <section className={styles.view_recent}>
          <Title text="최근에 본 공고" />
          <ul className="post_list">
            {recentPosts.map(({ item }) =>
              item ? (
                <li key={item.id}>
                  <PostCard data={item} />
                </li>
              ) : null
            )}
          </ul>
        </section>
      </div>
    </>
  );
};
export default ViewPage;
