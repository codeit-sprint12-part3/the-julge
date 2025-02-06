import styles from "@/components/ui/Badge.module.css";
import { Icon } from "../icon/Icon";

type BadgeType = "pending" | "accepted" | "rejected" | "canceled" | "increased";

type StateType = "done";

interface BadgeProps {
  type: BadgeType;
  state?: StateType;
  originalHourlyPay?: number;
  hourlyPay?: number;
}

const badgeText: Record<BadgeType, string> = {
  pending: "대기중",
  accepted: "승인 완료",
  rejected: "거절",
  canceled: "취소",
  increased: "시급 증가",
};

export default function Badge({ type, hourlyPay, state, originalHourlyPay }: BadgeProps) {
  let text = badgeText[type];
  let additionalStyle = "";

  if (type === "increased" && hourlyPay && originalHourlyPay) {
    const increaseRate = Math.round(((hourlyPay - originalHourlyPay) / originalHourlyPay) * 100);
    text = `기존 시급보다 ${increaseRate}%`;

    additionalStyle = increaseRate >= 50 ? styles.increased_up : styles.increased_down;
  }

  return (
    <span
      className={`${styles.badge} ${styles[type]} ${
        state === "done" ? styles.done : ""
      } ${additionalStyle}`}
    >
      {text}
      {type === "increased" && (
        <Icon name="upArr" size={13} color={"white"} className={styles.upArr} />
      )}
    </span>
  );
}
