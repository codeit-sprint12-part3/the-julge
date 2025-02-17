import { useState, useEffect } from "react";
import style from "./Top.module.css";

const Top = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 스크롤 이벤트 리스너 추가 및 제거
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 페이지 상단으로 부드럽게 이동하는 함수
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 동작 막기 (링크 클릭 방지)

    // window.scrollTo 사용
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`${style.top} ${isVisible ? style.active : ""}`}
        >
          TOP
        </button>
      )}
    </>
  );
};

export default Top;
