import React, { useEffect, useRef, useState } from "react";
import { formatWorkDate } from "@/utils/formatWorkDate";
import styles from "@/components/ui/Table.module.css";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";

// 개별 공고 정보 타입
export interface NoticeItem {
  id: string;
  hourlyPay: number;
  description: string;
  startsAt: string;
  workhour: number;
  closed: boolean;
}

// 개별 가게 정보 타입
export interface ShopItem {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

// 지원 상태 타입
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "canceled";

// 지원 정보 타입
export interface ApplicationItem {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  shop: ShopItem;
  notice: NoticeItem;
}

// API 응답 타입
interface ApplicationProps {
  data: ApplicationItem[];
}

const Application: React.FC<ApplicationProps> = ({ data }) => {
  const tableWrapRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return;

    const handleScroll = () => {
      const isScrollable = tableWrap.scrollWidth > tableWrap.clientWidth;
      const isAtEnd = tableWrap.scrollLeft + tableWrap.clientWidth >= tableWrap.scrollWidth - 1;
      setHasScroll(isScrollable && !isAtEnd);
    };

    handleScroll();
    tableWrap.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      tableWrap.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // 테이블 영역에서 마우스 휠로 X축 스크롤
  useEffect(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return;

    const handleWheelScroll = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        tableWrap.scrollLeft += e.deltaY * 2; // 가로 스크롤 이동 속도 조정
      }
    };

    tableWrap.addEventListener("wheel", handleWheelScroll);

    return () => {
      tableWrap.removeEventListener("wheel", handleWheelScroll);
    };
  }, []);

  // Pagination 관련
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = data.slice(startIndex, startIndex + postsPerPage);

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
            {currentPosts.map((app, idx) => (
              <ul className={styles.tr} key={idx}>
                <li className={styles.td}>{app.shop.name}</li>
                <li className={styles.td}>
                  {formatWorkDate(app.notice.startsAt, app.notice.workhour)}
                </li>
                <li className={styles.td}>{app.notice.hourlyPay.toLocaleString()}원</li>
                <li className={styles.td}>
                  {app.status === "rejected" ? (
                    <Badge type="rejected" />
                  ) : app.status === "pending" ? (
                    <Badge type="pending" />
                  ) : app.status === "accepted" ? (
                    <Badge type="accepted" />
                  ) : null}
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className={`page ${styles.page}`}>
        <Pagination
          totalPosts={data.length}
          postsPerPage={postsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Application;
