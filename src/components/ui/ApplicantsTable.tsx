import { useModal } from "@/context/ModalContext";
import { useAuthUser } from "@/stores/useAuthUser";
import { ApplicationResponse, ApplicationWrapper, NoticeWrapper } from "@/type";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./ApplicantsTable.module.css";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { getApplicationsForNotice, updateApplicationStatus } from "@/lib/applications";
import { toast } from "@/pages/_app";
import { getShopNotice } from "@/lib/notices";

const ApplicantsTable = () => {
  const router = useRouter();
  const { shopId, noticeId } = router.query;
  const { openModal, closeModal } = useModal();
  const { token, user, logout, fetchAndSetUser } = useAuthUser();
  const [postData, setPostData] = useState<NoticeWrapper>();
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);

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

  // 유저 정보 불러오기 [시작]
  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser();
    }
  }, [token, user, fetchAndSetUser]);
  // 유저 정보 불러오기 [종료]

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
  // 지원자 목록 불러오기 [종료]

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
    <section className={styles.view_list}>
      <Title text="신청자 목록" />
      {userList.length === 0 ? (
        <div className={styles.empty}>신청자가 없습니다.</div>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
};
export default ApplicantsTable;
