import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({ totalPosts, postsPerPage, currentPage, setCurrentPage }: PaginationProps) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const maxVisiblePages = 7; // 한 번에 보여줄 최대 페이지 개수
  const shouldHideArrows = totalPages <= maxVisiblePages; // 페이지 개수가 7개 이하일 때 화살표 숨김

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
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 || shouldHideArrows ? styles.hide : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.4629 17.4702C13.1701 17.7631 12.6952 17.7631 12.4023 17.4702L5.53048 10.5984C5.38983 10.4577 5.31081 10.2669 5.31081 10.068C5.31081 9.86911 5.38983 9.67834 5.53048 9.53769L12.4023 2.66588C12.6952 2.37299 13.1701 2.37299 13.4629 2.66588C13.7558 2.95878 13.7558 3.43365 13.4629 3.72654L7.12147 10.068L13.4629 16.4095C13.7558 16.7024 13.7558 17.1773 13.4629 17.4702Z"
                fill="#111322"
              />
            </svg>
          </button>
        </li>

        {/* 페이지 번호 */}
        {getPageNumbers().map((page) => (
          <li key={page}>
            <button
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? styles.active : ""}
            >
              {page}
            </button>
          </li>
        ))}

        {/* 오른쪽 화살표 */}
        <li>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className={currentPage === totalPages || shouldHideArrows ? styles.hide : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.46967 17.4702C6.76256 17.7631 7.23744 17.7631 7.53033 17.4702L14.4021 10.5984C14.5428 10.4577 14.6218 10.2669 14.6218 10.068C14.6218 9.86911 14.5428 9.67834 14.4021 9.53769L7.53033 2.66588C7.23744 2.37299 6.76256 2.37299 6.46967 2.66588C6.17678 2.95878 6.17678 3.43365 6.46967 3.72654L12.8111 10.068L6.46967 16.4095C6.17678 16.7024 6.17678 17.1773 6.46967 17.4702Z"
                fill="#111322"
              />
            </svg>
          </button>
        </li>
      </ul>
    </section>
  );
};

export default Pagination;
