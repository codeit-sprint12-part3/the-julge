import { Pagination, PaginationItem } from "@mui/material";
import styles from "./CustomPagination.module.css";

const CustomPagination = () => {
  return (
    <Pagination
      count={7}
      className={styles.pagination}
      renderItem={(item) => (
        <PaginationItem {...item} id={`${item.selected ? styles.activePage : ""}`} />
      )}
    />
  );
};

export default CustomPagination;
