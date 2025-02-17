import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getShopInfo } from "@/lib/shops";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import style from "./Myshop.module.css";
import MyshopRegInfo from "@/components/my-shop/MyshopRegInfo";
import AuthGuard from "@/components/auth/AuthGuard";
import { getShopNotices } from "@/lib/notices";

function Page() {
  const router = useRouter();
  const { shopId } = router.query;
  const [shop, setShop] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    if (!shopId) return;

    // 가게 정보 가져오기
    getShopInfo(shopId as string)
      .then((data) => setShop(data.item))
      .catch((error) => console.error("가게 정보 가져오기 오류:", error));

    // 가게 공고 목록 가져오기
    getShopNotices(shopId as string, { offset: 0, limit: 10 })
      .then((data) => {
        setNotices(data.items);
      })
      .catch((error) => console.error("공고 목록 가져오기 오류:", error));

  }, [shopId]);

  if (!shop) return <p>가게 정보를 찾을 수 없습니다.</p>;

  return (
    <div className={style.myshopContainer}>
      <Title text="가게 상세 정보" />
      <div className={style.myshopDetailContainer}>
        <div className={style.detailImgBox}>
          <img src={shop.imageUrl} alt={shop.name} className={style.shopImage} />
        </div>

        <div className={style.detailTextBox}>
          <span className={style.subText}>{shop.category}</span>
          <h3 className={style.detailTatle}>{shop.name}</h3>
          <address>{shop.address1}</address>
          <p>{shop.description}</p>
          <div className={style.btnBox}>
            <Button
              className={style.detailBtn}
              buttonText="편집하기"
              size="large"
              styleButton="secondary"
              onClick={() => router.push(`/my-shop/edit?shopId=${shopId}`)}
            />
            <Button
              className={style.detailBtn}
              buttonText="공고등록하기"
              size="large"
              styleButton="primary"
              onClick={() => router.push(`/my-shop/jobs/write?shopId=${shopId}`)}
            />
          </div>
        </div>
      </div>

      <div className={style.announcementRegBox}>
        {notices.length > 0 ? (
          <>
            <Title text="내가 등록한 공고" />
            <ul className="post_list">
              {notices.map((noticeItem) => (
                <li key={noticeItem.id} className={style.noticeItem}>
                  {noticeItem.item.description}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <Title text="등록한 공고" />
            <MyshopRegInfo
              infoText="공고를 등록해 보세요."
              buttonText="공고 등록하기"
              href={`/my-shop/jobs/write?shopId=${shopId}`}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AuthGuard(Page, "employer");
