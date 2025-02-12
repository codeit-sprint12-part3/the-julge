import { useEffect, useRef } from "react";
import styles from "@/components/alerts/Alerts.module.css";
import AlertsItem from "./AlertsItem";
import { useAuthUser } from "@/stores/useAuthUser";
import { toast } from "react-toastify";

interface AlertsProps {
  onClose: () => void;
}

const Alerts = ({ onClose }: AlertsProps) => {
  const { alerts, fetchAndSetAlerts, markAlertAsRead } = useAuthUser();
  const alertsRef = useRef<HTMLDivElement>(null);
  const alertLength = alerts.length;
  const toastShownRef = useRef(false);

  useEffect(() => {
    fetchAndSetAlerts();
  }, [fetchAndSetAlerts]);

  useEffect(() => {
    if (alertLength === 0 && !toastShownRef.current) {
      toast("알림 없음 👀");
      toastShownRef.current = true;
      onClose();
    }
  }, [alertLength, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAlertRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);
      await fetchAndSetAlerts();
      toast("알림 확인 👀");
    } catch (error) {
      console.error("Error reading alert:", error);
    }
  };

  if (alertLength === 0) return null;

  return (
    <div ref={alertsRef} className={styles["alert-wrapper"]}>
      <div className={styles["alert-title"]}>
        <h3>알림 {alerts.length}개</h3>
      </div>
      <div className={`${styles["alert-contents"]} ${styles["scrollable"]}`}>
        {alerts.map((alertData) => (
          <AlertsItem
            key={alertData.item.id}
            alertItem={alertData.item}
            handleAlertRead={handleAlertRead}
          />
        ))}
      </div>
    </div>
  );
};

export default Alerts;
