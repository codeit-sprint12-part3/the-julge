import styles from "./Title.module.css";

interface Props {
  text: React.ReactNode;
  children?: React.ReactNode;
}

const Title = ({ text, children }: Props) => {
  return (
    <div className={styles.title_box}>
      <h3>{text}</h3>
      {children && <div className={styles.children}>{children}</div>}
    </div>
  );
};
export default Title;
