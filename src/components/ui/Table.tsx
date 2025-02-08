import React, { useEffect, useRef, useState } from "react";
import styles from "./Table.module.css";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";

interface RowData {
  store: string;
  date: string;
  wage: string;
  status: "승인 완료" | "거절" | "대기중";
}

const rows: RowData[] = [
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "거절",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "승인 완료",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "거절",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
  {
    store: "너구리네 라면집",
    date: "2023.01.12 10:00 ~ 12:00 (2시간)",
    wage: "12,500원",
    status: "대기중",
  },
];

const Table = () => {
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

  // --------------------------------------------------------
  // ----------------- Pagination 관련 Start -----------------
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가 , 처음 기본값 설정
  const postsPerPage = 5; // 한 페이지에 보여줄 게시글 개수

  // 현재 페이지에 해당하는 데이터만 slice (실제 api 적용할때 수정필요할수도!)
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = rows.slice(startIndex, startIndex + postsPerPage);
  // ----------------- Pagination 관련 End -------------------
  // --------------------------------------------------------

  return (
    <>
      <div
        ref={tableWrapRef}
        className={`scrollable ${styles.table_wrap} ${hasScroll ? styles.scroll : ""}`}
      >
        <div className={styles.table}>
          <div className={styles.thead}>
            <ul className={styles.th}>
              <li className={styles.td}>가게</li>
              <li className={styles.td}>일자</li>
              <li className={styles.td}>시급</li>
              <li className={styles.td}>상태</li>
            </ul>
          </div>
          <div className={styles.tbody}>
            {currentPosts.map((data, idx) => {
              return (
                <ul className={styles.tr} key={idx}>
                  <li className={styles.td}>{data.store}</li>
                  <li className={styles.td}>{data.date}</li>
                  <li className={styles.td}>{data.wage}</li>
                  <li className={styles.td}>
                    {data.status === "거절" ? (
                      <Badge type="rejected" />
                    ) : data.status === "대기중" ? (
                      <Badge type="pending" />
                    ) : data.status === "승인 완료" ? (
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
          totalPosts={rows.length} // total 게시글 개수
          postsPerPage={postsPerPage} // 한 페이지에 보여줄 게시글 개수
          currentPage={currentPage} // 현재 페이지
          setCurrentPage={setCurrentPage} // 페이지 변경 함수
        />
      </div>
    </>
  );
};

export default Table;
