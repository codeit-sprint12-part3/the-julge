import MyshopRegInfo from "@/components/my-shop/MyshopRegInfo";
import Title from "@/components/ui/Title";
import style from "@/pages/my-shop/Myshop.module.css";

export default function Myshop() {
  return (
    <div className={style.myshopContainer}>
      <Title
        text="내 가게"
      />
      <MyshopRegInfo
        infoText="내 가게를 소개하고 공고도 등록해 보세요."
        buttonText="가게 등록하기"
        href="/my-shop/write"
      />
    </div>
  );
}
