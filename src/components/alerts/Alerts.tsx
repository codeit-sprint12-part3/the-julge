import { useEffect } from "react";
import styles from "@/components/alerts/Alerts.module.css";
import AlertsItem from "./AlertsItem";
import { useAuthUser } from "@/stores/useAuthUser";

const Alerts = () => {
  const { alerts, fetchAndSetAlerts } = useAuthUser();

  useEffect(() => {
    fetchAndSetAlerts();

    console.log(alerts);
  }, [fetchAndSetAlerts]);

  return (
    <div className={styles["alert-wrapper"]}>
      <div className={styles["alert-title"]}>
        <h3>알림 {alerts.length}개</h3>
      </div>
      <div className={`${styles["alert-contents"]} ${styles["scrollable"]}`}>
        {alerts.map((alertData) => (
          <AlertsItem key={alertData.item.id} alertItem={alertData.item} />
        ))}
      </div>
    </div>
  );
};

export default Alerts;
