import Button from "../ui/Button";
import style from "./MyshopRegInfo.module.css";

interface MyshopRegInfoProps {

  buttonText: string;
  infoText: string;
  href?: string;

}

export default function MyshopRegInfo({ infoText, buttonText, href }: MyshopRegInfoProps) {

  return (
    <div className={style.myshopInfoBox}>
      <p>
        {infoText}
      </p>
      <Button
        buttonText={buttonText}
        size="large"
        styleButton="primary"
        href={href}
      />
    </div>
  )

}