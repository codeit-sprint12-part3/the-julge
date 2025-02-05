import styles from "@/components/ui/Badge.module.css";
import { Icon } from "../icon/Icon";

type BadgeType = "pending" | "accepted" | "rejected" | "canceled" | "increased";

type StateType = "done";

interface BadgeProps {
  type: BadgeType;
  pay?: number;
  state?: StateType;
}

const MINIMUM_PAY_2025 = 10030;

const badgeText: Record<BadgeType, string> = {
  pending: "대기중",
  accepted: "승인 완료",
  rejected: "거절",
  canceled: "취소",
  increased: "시급 증가",
};

export default function Badge({ type, pay, state }: BadgeProps) {
  let text = badgeText[type];

  if (type === "increased" && pay) {
    const increaseRate = Math.round(((pay - MINIMUM_PAY_2025) / MINIMUM_PAY_2025) * 100);
    text = `최저 시급보다 ${increaseRate}%`;
  }

  return (
    <span className={`${styles.badge} ${styles[type]} ${state === "done" ? styles.done : ""}`}>
      {text}
      {type === "increased" && (
        <Icon name="upArr" size={13} color={"white"} className={styles.upArr} />
      )}
    </span>
  );
}
