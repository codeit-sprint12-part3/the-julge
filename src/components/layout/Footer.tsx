import Link from "next/link";
import style from "@/components/layout/Footer.module.css";
import { Icon } from "../icon/Icon";

const Footer = () => {
  return (
    <footer className={style["footer-container"]}>
      <div className={style["footer-wrapper"]}>
        <p>©codeit - 2023</p>
        <ul className={style["footer-nav"]}>
          <li>
            <Link href={"/"}>Privacy Policy</Link>
          </li>
          <li>
            <Link href={"/"}>FAQ</Link>
          </li>
        </ul>
        <ul className={style["footer-sns"]}>
          <li>
            <Link href={"/"}>
              <Icon name="mail" color={"gray-500"} />
            </Link>
          </li>
          <li>
            <Link href={"/"}>
              <Icon name="facebook" color={"gray-500"} />
            </Link>
          </li>
          <li>
            <Link href={"/"}>
              <Icon name="instargram" color={"gray-500"} />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
