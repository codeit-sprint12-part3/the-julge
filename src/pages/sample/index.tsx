import styles from "./index.module.css";
import Geon from "./components/Geon";
import Sang from "./components/Sang";
import Seung from "./components/Seung";
import Sol from "./components/Sol";

export default function Page() {
  return (
    <div className={styles["sample-wrapper"]}>
      <h2>The-Julge 공용 컴포넌트 샘플</h2>
      <section>
        <h3>승석님 컴포넌트</h3>
        <Seung />
      </section>
      <section>
        <h3>상석님 컴포넌트</h3>
        <Sang />
      </section>
      <section>
        <h3>인건님 컴포넌트</h3>
        <Geon />
      </section>
      <section>
        <h3>한솔님 컴포넌트</h3>
        <Sol />
      </section>
    </div>
  );
}
