import Link from "next/link";
import Image from "next/image";
import style from "@/components/layout/Header.module.css";
import { Icon } from "../icon/Icon";

const Header = () => {
  return (
    <header className={style["header-container"]}>
      <div className={style["header-wrapper"]}>
        <Link href={"/"} className={style["header-logo"]}>
          <Image
            src="/logo.svg"
            alt="더줄게 로고"
            width={108}
            height={20}
            className={style["header-logo-img"]}
          />
        </Link>
        <div className={style["header-search"]}>
          <Icon
            name="search"
            size={19}
            color={"gray-500"}
            className={style["header-search-icon"]}
          />
          <input type="text" placeholder="가게 이름으로 찾아보세요" />
        </div>
        <ul className={style["header-nav"]}>
          <li>
            <Link href={"/user"}>내 프로필</Link>
          </li>
          {/* <li>
            <Link href={"/my-shop"}>내 가게</Link>
          </li> */}
          <li>
            <Link href={"/auth/login"}>로그인</Link>
          </li>
          {/* <li>
            <Link href={"/auth/logout"}>로그아웃</Link>
          </li> */}
          <li>
            <Link href={"/auth/logout"}>
              <Icon name="alter" color={"black"} className={style["header-alter-icon"]} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
