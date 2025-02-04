import Alerts from "@/components/alerts/Alerts";
import styles from "./Sol.module.css";

const Sol = () => {
  return (
    <div>
      <div>
        <h4 className={styles.title}>[알림창 - Alerts]</h4>
        <Alerts />
      </div>
    </div>
  );
};

export default Sol;
