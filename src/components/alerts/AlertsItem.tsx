import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "@/components/alerts/AlertsItem.module.css";
import { AlertsItemProps } from "@/components/alerts/AlertsTypes";

const AlertsItem = ({ data }: AlertsItemProps) => {
  const { shop, notice, result } = data;
  const shopName = shop.item.name;

  dayjs.locale("ko");
  dayjs.extend(relativeTime);
  const workhour = notice.item.workhour;
  const startsAt = dayjs(notice.item.startsAt).format("YYYY-MM-DD HH:mm");
  const endsAt = dayjs(notice.item.startsAt).add(workhour, "hour").format("HH:mm");
  const createdAt = new Date(data.createdAt);
  const timeAgo = dayjs(createdAt).fromNow();

  let resultText = "";
  switch (result) {
    case "accepted":
      resultText = "승인";
      break;
    case "rejected":
      resultText = "거절";
      break;
    case "cancelled":
      resultText = "취소";
      break;
    default:
      resultText = "";
  }

  return (
    <div className={`${styles["alert-item"]} ${styles[result]}`}>
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
