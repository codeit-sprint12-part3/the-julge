import Link from "next/link";
import styles from "./PostCard.module.css";
import { Icon } from "../icon/Icon";
import dayjs from "dayjs";
import Badge from "./Badge";
import { NoticeItem } from "@/type";
import { motion } from "framer-motion";

interface PostCardProps {
  data?: NoticeItem;
  isLoading?: boolean;
  link?: string
}

const PostCard = ({ link, data, isLoading = false }: PostCardProps) => {
  if (isLoading) {
    return (
      <div className={`${styles.post_box} loading_box`}>
        <a>
          <div className={styles.thumbnail}></div>
        </a>
        <div className={styles.content}>
          <h3>&nbsp;</h3>
          <ul>
            <li>
              <span>&nbsp;</span>
            </li>
            <li>
              <span>&nbsp;</span>
            </li>
          </ul>
          <div className={styles.price}>
            <p>&nbsp;</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { id, workhour, startsAt, hourlyPay, description, closed, shop } = data;
  const shopId = shop.item.id;
  const formatStartsAt = dayjs(startsAt);
  const formatted = `${formatStartsAt.format("YYYY-MM-DD HH:mm")}~${formatStartsAt
    .add(workhour, "hour")
    .format("HH:mm")} (${workhour}시간)`;

  const isPast = dayjs().isAfter(formatStartsAt) && !closed;
  const statusText = closed ? "마감 완료" : isPast ? "지난공고" : "";

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06)",
      }}
      className={`${styles.post_box} ${closed ? styles.end : ""} ${isPast ? styles.end : ""}`}
    >
      <Link href={link ? link : `/view/${shopId}/${id}`}>
        <div className={styles.thumbnail}>
          <span className={styles.end}>{statusText}</span>
          <figure>
            <img src={shop.item.imageUrl} alt={shop.item.name} />
          </figure>
        </div>
        <div className={styles.content}>
          <h3>{shop.item.name}</h3>
          <ul>
            <li>
              <Icon name="time" color="var(--red-200)" />
              <span>{formatted}</span>
            </li>
            <li>
              <Icon name="map" color="var(--red-200)" />
              <span>{shop.item.address1}</span>
            </li>
          </ul>
          <div className={styles.price}>
            <p>{hourlyPay.toLocaleString()}원</p>
            <Badge
              type="increased"
              hourlyPay={hourlyPay}
              originalHourlyPay={shop.item.originalHourlyPay}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;
