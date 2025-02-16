import { useAuthUser } from "@/stores/useAuthUser";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import style from "@/components/layout/Header.module.css";
import { Icon } from "@/components/icon/Icon";
import { useState, useEffect } from "react";
import Alerts from "../alerts/Alerts";

const Header = () => {
  const { token, user, logout, fetchAndSetUser } = useAuthUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser();
    }
  }, [token, user, fetchAndSetUser]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/search?keyword=${searchValue}`);
    }
  };

  const handleAlerts = () => {
    setIsAlertsOpen((prev) => !prev);
  };

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
            color={"--gray-500"}
            className={style["header-search-icon"]}
          />
          <input
            type="text"
            placeholder="가게 이름으로 찾아보세요"
            value={searchValue}
            onChange={onChangeSearch}
            onKeyDown={onKeyDownSearch}
          />
        </div>
        <ul className={style["header-nav"]}>
          {isClient && token && user?.type === "employee" && (
            <li>
              <Link href={"/user"}>내 프로필</Link>
            </li>
          )}
          {isClient && token && user?.type === "employer" && (
            <li>
              <Link href={"/my-shop"}>내 가게</Link>
            </li>
          )}
          {isClient && !token && (
            <>
              <li>
                <Link href={"/auth/login"}>로그인</Link>
              </li>
              <li>
                <Link href={"/auth/signup"}>회원가입</Link>
              </li>
            </>
          )}

          {isClient && token && (
            <li>
              <button onClick={handleLogout} className={style["logout-button"]}>
                로그아웃
              </button>
            </li>
          )}
          {isClient && token && user?.type === "employee" && (
            <li className={style["header-alter-box"]}>
              <button onClick={handleAlerts}>
                <Icon name="alter" color={"black"} className={style["header-alter-icon"]} />
              </button>
              {isAlertsOpen && <Alerts onClose={handleAlerts} />}
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
