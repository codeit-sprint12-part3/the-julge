import AuthGuard from "@/components/auth/AuthGuard";
import { useModal } from "@/context/ModalContext";
import { getShopNotice } from "@/lib/notices";
import { useAuthUser } from "@/stores/useAuthUser";
import { ApplicationResponse, ApplicationWrapper, NoticeWrapper } from "@/type";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./jobs.module.css";
import dayjs from "dayjs";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Icon } from "@/components/icon/Icon";
import Pagination from "@/components/ui/Pagination";
import { getApplicationsForNotice, updateApplicationStatus } from "@/lib/applications";
import { toast } from "@/pages/_app";

function Page() {
  const router = useRouter();
  const { shopId, noticeId } = router.query;

  const { openModal, closeModal } = useModal();
  const { token, user, logout, fetchAndSetUser } = useAuthUser();
  const [isClient, setIsClient] = useState(false);
  const [postData, setPostData] = useState<NoticeWrapper>();
  const [statusText, setStatusText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);

  // 유저 정보 불러오기 [시작]
  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser();
    }
  }, [token, user, fetchAndSetUser]);
  // 유저 정보 불러오기 [종료]

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

  // 공고 시작 시간 포맷팅 [시작]
  const formatStartsAt = dayjs(postData?.item.startsAt);
  const formatted = `${formatStartsAt.format("YYYY-MM-DD HH:mm")}~${formatStartsAt
    .add(postData?.item.workhour as number, "hour")
    .format("HH:mm")} (${postData?.item.workhour}시간)`;
  // 공고 시작 시간 포맷팅 [종료]

  // 마감 여부 및 지난 공고 여부 확인 [시작]
  const closed = postData?.item.closed;
  const isPast = dayjs().isAfter(formatStartsAt) && !closed;
  useEffect(() => {
    if (!postData) return;
    const formatStartsAt = dayjs(postData?.item.startsAt);
    const isPast = dayjs().isAfter(formatStartsAt) && !postData?.item.closed;
    const closed = postData?.item.closed;
    setStatusText(closed ? "마감 완료" : isPast ? "지난공고" : "");
  }, [postData]);
  // 마감 여부 및 지난 공고 여부 확인 [종료]

  const buttonAction = () => {
    router.push(`/my-shop/jobs/${shopId}/${noticeId}/edit`);
  };

  // 테이블 [시작]
  const tableWrapRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return;

    const handleScroll = () => {
      const isScrollable = tableWrap.scrollWidth > tableWrap.clientWidth;
      const isAtEnd = tableWrap.scrollLeft + tableWrap.clientWidth >= tableWrap.scrollWidth - 1; // 소수점 오류 방지

      setHasScroll(isScrollable && !isAtEnd);
    };

    handleScroll(); // 초기 상태 설정
    tableWrap.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // 화면 크기 변경 시 체크

    return () => {
      tableWrap.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  // 테이블 [종료]

  //지원자 목록 불러오기 [시작]
  const [userList, setUserList] = useState<ApplicationWrapper[]>([]);
  const fetchListData = async () => {
    if (!router.isReady || !shopId || !noticeId) return;

    try {
      const ListData: ApplicationResponse = await getApplicationsForNotice(
        shopId as string,
        noticeId as string,
        (currentPage - 1) * itemsPerPage,
        itemsPerPage
      );
      setTotalItems(ListData.count || 0);
      setUserList(ListData.items || []);
    } catch (error) {
      console.error("지원자 목록 요청 중 오류 발생:", error);
    }
  };

  // 처음 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchListData();
  }, [router.isReady, shopId, noticeId, currentPage]);
  //지원자 목록 불러오기 [종료]

  // 지원자 승인 시작 [시작]
  const handleStatusUpdate = (applicationId: string, newStatus: "accepted" | "rejected") => {
    if (!shopId || !noticeId || !token) return;

    const onConfirm = async () => {
      try {
        closeModal();
        await updateApplicationStatus(
          shopId as string,
          noticeId as string,
          applicationId,
          newStatus
        );
        toast(newStatus === "accepted" ? "승인이 완료되었습니다." : "거절되었습니다.");

        fetchListData();
      } catch (error) {
        console.error(error);
        toast("처리 중 오류가 발생했습니다.");
      }
    };

    openModal(
      "confirm",
      `해당 신청을 ${newStatus === "accepted" ? "승인" : "거절"}하시겠습니까?`,
      onConfirm
    );
  };
  // 지원자 승인 종료 [종료]

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
              <Button
                buttonText="공고 편집하기"
                size="large"
                styleButton="secondary"
                onClick={buttonAction}
              />
            </div>
          </div>
          <div className={styles.description}>
            <h3>공고 설명</h3>
            <p>{postData?.item.description}</p>
          </div>
        </section>
        <section className={styles.view_list}>
          <Title text="신청자 목록" />
          <div
            ref={tableWrapRef}
            className={`scrollable ${styles.table_wrap} ${hasScroll ? styles.scroll : ""}`}
          >
            <div className={styles.table}>
              <div className={styles.thead}>
                <ul className={styles.th}>
                  <li className={styles.td}>신청자</li>
                  <li className={styles.td}>소개</li>
                  <li className={styles.td}>전화번호</li>
                  <li className={styles.td}>상태</li>
                </ul>
              </div>
              <div className={styles.tbody}>
                {userList.map((data) => {
                  return (
                    <ul className={styles.tr} key={data.item.id}>
                      <li className={styles.td}>{data.item.user.item.name}</li>
                      <li className={styles.td}>
                        <div className={styles.line2}>{data.item.user.item.bio}</div>
                      </li>
                      <li className={styles.td}>{data.item.user.item.phone}</li>
                      <li className={styles.td}>
                        {data.item.status === "rejected" ? (
                          <Badge type="rejected" />
                        ) : data.item.status === "pending" ? (
                          <div className={styles.btn_wrap}>
                            <Button
                              buttonText="거절하기"
                              size="medium"
                              styleButton="secondary"
                              onClick={() => handleStatusUpdate(data.item.id, "rejected")}
                            />
                            <Button
                              buttonText="승인하기"
                              size="medium"
                              styleButton="secondary"
                              onClick={() => handleStatusUpdate(data.item.id, "accepted")}
                            />
                          </div>
                        ) : data.item.status === "accepted" ? (
                          <Badge type="accepted" />
                        ) : null}
                      </li>
                    </ul>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={`page ${styles.page}`}>
            <Pagination
              totalPosts={totalItems} // total 게시글 개수
              postsPerPage={itemsPerPage} // 한 페이지에 보여줄 게시글 개수
              currentPage={currentPage} // 현재 페이지
              setCurrentPage={setCurrentPage} // 페이지 변경 함수
            />
          </div>
        </section>
      </div>
    </>
  );
}
export default AuthGuard(Page, "employer");