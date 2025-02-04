import styles from "@/styles/errorPage.module.css";
import { useRouter } from "next/router";

const Error404Page = () => {
  const router = useRouter();

  const onClickBackButton = () => {
    router.back();
  };

  const onClickHomeButton = () => {
    router.push("/");
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.emoji}>🥹</span>
      <h1 className={styles.title}>404</h1>
      <p className={styles.contents}>
        찾을 수 없는 페이지입니다.
        <br />
        요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요 :)
      </p>
      <div className={styles.buttons}>
        <button onClick={onClickHomeButton}>메인으로</button>
        <button onClick={onClickBackButton}>이전 페이지</button>
      </div>
    </div>
  );
};

Error404Page.displayName = "Error404Page";

export default Error404Page;
