import { useEffect, useState } from "react";
import styles from "./view.module.css";
import { NoticeWrapper } from "@/type";
import Title from "@/components/ui/Title";
import PostCard from "@/components/ui/PostCard";
import Head from "next/head";
import DetailTopBox from "@/components/ui/DetailTopBox";

const ViewPage = () => {
  const [postData, setPostData] = useState<NoticeWrapper>();
  const [recentPosts, setRecentPosts] = useState<NoticeWrapper[]>([]);

  // 로컬스토리지에서 최근에 본 공고 불러오기 [시작]
  useEffect(() => {
    const storedPosts: NoticeWrapper[] = JSON.parse(localStorage.getItem("recentPosts") || "[]");
    setRecentPosts(storedPosts);
    // 현재 공고를 로컬스토리지에 저장
    if (postData) {
      const updatedPosts: NoticeWrapper[] = [
        postData,
        ...storedPosts.filter((post) => post.item.id !== postData.item.id),
      ].slice(0, 6);
      localStorage.setItem("recentPosts", JSON.stringify(updatedPosts));
      setRecentPosts(updatedPosts);
    }
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
            {recentPosts.map(({ item }) => {
              if (!item) return null;
              return (
                <li key={item.id}>
                  <PostCard data={item} />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
};
export default ViewPage;
