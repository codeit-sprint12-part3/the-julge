import { useEffect } from "react";
import { Icon } from "../icon/Icon";
import styles from "./Pagination.module.css";
import { useRouter } from "next/router";

interface PaginationProps {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({ totalPosts, postsPerPage, currentPage, setCurrentPage }: PaginationProps) => {
  const router = useRouter();
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const maxVisiblePages = 7; // 한 번에 보여줄 최대 페이지 개수
  const shouldHideArrows = totalPages <= maxVisiblePages; // 페이지 개수가 7개 이하일 때 화살표 숨김

  // ✅ URL에서 page 값을 가져와 초기값 설정
  useEffect(() => {
    const pageFromQuery = Number(router.query.page) || 1;
    if (pageFromQuery !== currentPage) {
      setCurrentPage(pageFromQuery);
    }
  }, [router.query.page]);

  // ✅ 페이지 변경 시 URL 업데이트
  const updatePage = (page: number) => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page } }, // URL 쿼리스트링에 page 값 반영
      undefined,
      { shallow: true } // 페이지 전체 새로고침 없이 URL만 변경
    );
    setCurrentPage(page);
  };

  // 페이지 리스트 생성
  const getPageNumbers = () => {
    let startPage = Math.max(currentPage - 3, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <section className={styles.pagination}>
      <ul>
        {/* 왼쪽 화살표 */}
        <li>
          <button
            onClick={() => updatePage(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 || shouldHideArrows ? styles.hide : ""}
          >
            <Icon name="leftArr" color="var(--black)" size={16} />
          </button>
        </li>

        {/* 페이지 번호 */}
        {getPageNumbers().map((page) => (
          <li key={page}>
            <button
              onClick={() => updatePage(page)}
              className={currentPage === page ? styles.active : ""}
            >
              {page}
            </button>
          </li>
        ))}

        {/* 오른쪽 화살표 */}
        <li>
          <button
            onClick={() => updatePage(Math.min(currentPage + 1, totalPages))}
            className={currentPage === totalPages || shouldHideArrows ? styles.hide : ""}
          >
            <Icon name="rightArr" color="var(--black)" size={16} />
          </button>
        </li>
      </ul>
    </section>
  );
};

export default Pagination;
