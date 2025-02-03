import styles from "./Pagination.module.css";

const pagination = () => {
  return (
    <section className={styles.box}>
      <ul className={styles.list}>
        <li className={styles.arr}>
          <button>◀️</button>
        </li>
        <li>
          <button>1</button>
        </li>
        <li>
          <button>2</button>
        </li>
        <li>
          <button>3</button>
        </li>
        <li>
          <button>4</button>
        </li>
        <li>
          <button>5</button>
        </li>
        <li className={styles.arr}>
          <button>▶️</button>
        </li>
      </ul>
    </section>
  );
};
export default pagination;
