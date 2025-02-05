import styles from "@/components/alerts/Alerts.module.css";
import mockData from "./mockData.json";
import AlertsItem from "./AlertsItem";

const Alerts = () => {
  return (
    <div className={styles["alert-wrapper"]}>
      <div className={styles["alert-title"]}>
        <h3>알림 {mockData.count}개</h3>
      </div>
      <div className={`${styles["alert-contents"]} ${styles["scrollable"]}`}>
        {mockData.items.map((alertData) => (
          <AlertsItem key={alertData.item.id} data={alertData.item} />
        ))}
      </div>
    </div>
  );
};

export default Alerts;
