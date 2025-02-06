import Link from "next/link";
import styles from "./PostCard.module.css";
import { Icon } from "../icon/Icon";
import dayjs from "dayjs";
import Badge from "./Badge";
import { NoticeItem, ShopItem } from "@/type";

interface PostCardProps {
  data: NoticeItem;
}

const PostCard = ({ data }: PostCardProps) => {
  const { workhour, startsAt, hourlyPay, description, closed, shop } = data;
  const formatStartsAt = dayjs(startsAt);
  const formatted = `${formatStartsAt.format("YYYY-MM-DD HH:mm")}~${formatStartsAt
    .add(workhour, "hour")
    .format("HH:mm")} (${workhour}시간)`;

  return (
    <div className={`${styles.post_box} ${!closed ? styles.end : ""}`}>
      <Link href="/">
        <div className={styles.thumbnail}>
          <span className={styles.end}>마감 완료</span>
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
            <Badge type="increased" pay={hourlyPay} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
