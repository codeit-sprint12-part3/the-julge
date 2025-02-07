import { useEffect, useState } from "react";
import styles from "./view.module.css";
import { NoticeWrapper } from "@/type";
import { getShopNotice } from "@/lib/notices";
import { useRouter } from "next/router";
import Title from "@/components/ui/Title";
import Badge from "@/components/ui/Badge";
import dayjs from "dayjs";
import { Icon } from "@/components/icon/Icon";
import Button from "@/components/ui/Button";
import PostCard from "@/components/ui/PostCard";
import Head from "next/head";

const ViewPage = () => {
  const router = useRouter();
  const { shopId, noticeId } = router.query;
  const [postData, setPostData] = useState<NoticeWrapper>();
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

  const [recentPosts, setRecentPosts] = useState<NoticeWrapper[]>([]);

  useEffect(() => {
    // 로컬스토리지에서 최근에 본 공고 불러오기
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

  const formatStartsAt = dayjs(postData?.item.startsAt);
  const formatted = `${formatStartsAt.format("YYYY-MM-DD HH:mm")}~${formatStartsAt
    .add(postData?.item.workhour as number, "hour")
    .format("HH:mm")} (${postData?.item.workhour}시간)`;

  const closed = postData?.item.closed;
  const isPast = dayjs().isAfter(formatStartsAt) && !closed;
  const statusText = closed ? "마감 완료" : isPast ? "지난공고" : "";

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
        <section className={styles.view_content}>
          <div className={styles.category}>{postData?.item.shop.item.category}</div>
          <Title text={postData?.item.shop.item.name} />
          <div className={`${styles.box} ${closed ? styles.end : ""} ${isPast ? styles.end : ""}`}>
            <div className={styles.thumbnail}>
              <span className={styles.end}>{statusText}</span>
              <img src={postData?.item.shop.item.imageUrl} alt={postData?.item.shop.item.name} />
            </div>
            <div className={styles.content}>
              <p>시급</p>
              <div className={styles.price}>
                <p>{postData?.item.hourlyPay.toLocaleString()}원</p>
                <Badge
                  type="increased"
                  hourlyPay={postData?.item.hourlyPay}
                  originalHourlyPay={postData?.item.shop.item.originalHourlyPay}
                />
              </div>
              <ul>
                <li>
                  <Icon name="time" color="var(--red-200)" />
                  <span>{formatted}</span>
                </li>
                <li>
                  <Icon name="map" color="var(--red-200)" />
                  <span>{postData?.item.shop.item.address1}</span>
                </li>
              </ul>
              <div className={styles.txt}>
                <p>{postData?.item.shop.item.description}</p>
              </div>
              <Button buttonText="신청하기" size="large" styleButton="primary" />
            </div>
          </div>
          <div className={styles.description}>
            <h3>공고 설명</h3>
            <p>{postData?.item.description}</p>
          </div>
        </section>
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
