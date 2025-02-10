import { useAuthUser } from "@/stores/useAuthUser";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import style from "@/components/layout/Header.module.css";
import { Icon } from "@/components/icon/Icon";
import { useState, useEffect } from "react";

const Header = () => {
  const { token, user, logout, fetchAndSetUser } = useAuthUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // 클라이언트 렌더링 체크

  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser(); // 유저 정보 자동 로드
    }
  }, [token, user, fetchAndSetUser]);

  const handleLogout = () => {
    logout(); // Zustand에서 로그아웃 실행
    router.push("/");
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
          <input type="text" placeholder="가게 이름으로 찾아보세요" />
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
          <li>
            <button>
              <Icon name="alter" color={"black"} className={style["header-alter-icon"]} />
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
