import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "@/components/alerts/AlertsItem.module.css";
import { AlertItem } from "@/components/alerts/AlertsTypes";

interface AlertsItemProps {
  alertItem: AlertItem;
  handleAlertRead: (alertId: string) => void;
}

const AlertsItem = ({ alertItem, handleAlertRead }: AlertsItemProps) => {
  const { id, shop, notice, result } = alertItem;
  const shopName = shop.item.name;

  dayjs.locale("ko");
  dayjs.extend(relativeTime);
  const workhour = notice.item.workhour;
  const startsAt = dayjs(notice.item.startsAt).format("YYYY-MM-DD HH:mm");
  const endsAt = dayjs(notice.item.startsAt).add(workhour, "hour").format("HH:mm");
  const createdAt = new Date(alertItem.createdAt);
  const timeAgo = dayjs(createdAt).fromNow();

  let resultText = "";
  switch (result) {
    case "accepted":
      resultText = "승인";
      break;
    case "rejected":
      resultText = "거절";
      break;
    default:
      resultText = "";
  }

  return (
    <div
      className={`${styles["alert-item"]} ${styles[result]}`}
      onClick={() => handleAlertRead(id)}
    >
      <span className={`${styles["alert-state-icon"]}`}></span>
      <p>
        {`${shopName} (${startsAt}~${endsAt}) 공고 지원이 `}
        <span className={`${styles["alert-state-text"]}`}>{resultText}</span>
        {`되었어요.`}
      </p>
      <em>{timeAgo}</em>
    </div>
  );
};

export default AlertsItem;
