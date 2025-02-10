import Button from "../ui/Button";
import style from "./MyshopRegInfo.module.css";

interface MyshopRegInfoProps {

  buttonText: string;

}

export default function MyshopRegInfo({ buttonText }: MyshopRegInfoProps) {

  return (
    <div className={style.myshopInfoBox}>
      <p>
        내 가게를 소개하고 공고도 등록해보세요
      </p>
      <Button
        buttonText={buttonText}
        size="large"
        styleButton="primary"
        href="/my-shop/write"
      />
    </div>
  )

}