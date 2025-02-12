import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getShopInfo } from "@/lib/shops"; // API 호출 함수
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import style from "./Myshop.module.css";
import MyshopRegInfo from "@/components/my-shop/MyshopRegInfo";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

export default function MyshopDetail() {
  const router = useRouter();
  const { shopId } = router.query; // URL에서 shopId 가져오기
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      setLoading(true);
      getShopInfo(shopId as string)
        .then((data) => {
          setShop(data.item); // data.item으로 설정
          setLoading(false);
        })
        .catch((error) => {
          console.error("가게 정보를 불러오는데 실패했습니다:", error);
          setLoading(false);
        });
    }
  }, [shopId]);

  if (loading) return <SpinnerLoader />;
  if (!shop) return <p>가게 정보를 찾을 수 없습니다.</p>;

  return (
    <>
      <div className={style.myshopContainer}>
        <Title text="가게 상세 정보" />
        <div className={style.myshopDetailContainer}>
          <div className={style.detailImgBox}>
            <img src={shop.imageUrl} alt={shop.name} className={style.shopImage} />
          </div>

          <div className={style.detailTextBox}>
            <span className={style.subText}>
              {shop.category}
            </span>
            <h3 className={style.detailTatle}>{shop.name}</h3>
            <address>
              {shop.address1}
            </address>
            <p>
              {shop.description}
            </p>
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
          <Title text="등록한 공고" />
          <MyshopRegInfo
            infoText="공고를 등록해 보세요."
            buttonText="공고 등록하기"
            href={`/my-shop/jobs/write?shopId=${shopId}`}
          />
        </div>
      </div>
    </>
  );
}