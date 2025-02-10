import Button from "../ui/Button";
import style from "./MyshopRegInfo.module.css";

interface MyshopRegInfoProps {

  buttonText: string;
  infoText: string;

}

export default function MyshopRegInfo({ infoText, buttonText }: MyshopRegInfoProps) {

  return (
    <div className={style.myshopInfoBox}>
      <p>
        {infoText}
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