import { Pagination, PaginationItem, ThemeProvider } from "@mui/material";
import styles from "./CustomPagination.module.css";
import SeungTheme from "@/theme/SeungTheme";

const CustomPagination = () => {
  return (
    <ThemeProvider theme={SeungTheme}>
      <Pagination
        count={7}
        className={styles.pagination}
        renderItem={(item) => (
          <PaginationItem {...item} id={`${item.selected ? styles.activePage : ""}`} />
        )}
      />
    </ThemeProvider>
  );
};

export default CustomPagination;
