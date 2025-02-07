import styles from "@/styles/errorPage.module.css";
import { useRouter } from "next/router";

const ForbiddenPage = () => {
  const router = useRouter();

  const onClickHomeButton = () => {
    router.push("/");
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.emoji}>🚫</span>
      <h1 className={styles.title}>403</h1>
      <p className={styles.contents}>
        이 페이지에 접근할 권한이 없습니다.
        <br />
        다른 계정으로 로그인하거나, 홈으로 이동해주세요 :)
      </p>
      <div className={styles.buttons}>
        <button onClick={onClickHomeButton}>메인으로</button>
      </div>
    </div>
  );
};

ForbiddenPage.displayName = "ForbiddenPage";

export default ForbiddenPage;
