import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import style from "@/pages/my-shop/Myshop.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import MyshopRegInfo from "@/components/my-shop/MyshopRegInfo";

export default function MyshopDetail() {
  const router = useRouter();
  const [detailData, setDetailData] = useState(null);
  console.log(detailData);
  const [error, setError] = useState(null);
  const { shop_id } = router.query;

  const getDetailShopData = () => {
    try {
      axios
        .get(`https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/${shop_id}`)
        .then((response) => {
          setDetailData(response.data.item);
        })
        .catch((error) => {
          setError(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDetailShopData();
  }, [])

  return (
    <div className={style.myshopContainer}>
      <Title text="내 가게" />

      <div className={style.myshopDetailContainer}>
        <div className={style.detailImgBox}>
          img 영역
        </div>
        <div className={style.detailTextBox}>
          <span className={style.subText}>
            식당
          </span>
          <h3 className={style.detailTatle}>
            도토리 식당
          </h3>
          <address>
            서울시 송파구
          </address>
          <p>
            알바하기 편한 너구리네 라면집!
            라면 올려두고 끓이기만 하면 되어서 쉬운 편에 속하는 가게입니다.
          </p>
          <div className={style.btnBox}>
            <Button
              buttonText="편집하기"
              styleButton="secondary"
              className={style.detailBtn}
              type="submit"
              href={`/my-shop/edit?shop_id=${shop_id}`}
            />
            <Button
              buttonText="공고등록하기"
              styleButton="primary"
              className={style.detailBtn}
              type="submit"
            />
          </div>
        </div>
      </div>

      <div className={style.bgBox}>
        <Title text="등록한 공고" />
        <MyshopRegInfo
          buttonText="공고 등록하기"
        />
      </div>

    </div>

  );
}
