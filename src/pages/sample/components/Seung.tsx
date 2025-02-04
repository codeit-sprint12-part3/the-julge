import { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import style from "./Seung.module.css";
import { useModal } from "@/context/ModalContext";

const Seung = () => {
  // --------------------------------------------------------
  // ----------------- Pagination 관련 Start -----------------
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가 , 처음 기본값 설정
  const postsPerPage = 5; // 한 페이지에 보여줄 게시글 개수

  // 더미 데이터 생성 (예시입니다!)
  const posts = Array(50) // total 게시글 개수
    .fill(null)
    .map((_, index) => `${index + 1}번 게시글 내용입니다.`);

  // 현재 페이지에 해당하는 데이터만 slice (실제 api 적용할때 수정필요할수도!)
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);
  // ----------------- Pagination 관련 End -------------------
  // --------------------------------------------------------

  // --------------------------------------------------------
  // ----------------- Modal 관련 Start ----------------------
  const { openModal } = useModal();
  // 타입이 confirm일 경우 적용되는 함수 예시
  const TestConfirm = () => {
    console.log("함수 실행");
  };
  // ----------------- Modal 관련 End ------------------------
  // --------------------------------------------------------

  return (
    <>
      <div className={style.wrapper}>
        <ul>
          <li>
            <h3>Pagination</h3>
            <div className={style.box}>
              <ul>
                {currentPosts.map((post, index) => (
                  <li key={index}>{post}</li>
                ))}
              </ul>
              <Pagination
                totalPosts={50} // total 게시글 개수
                postsPerPage={postsPerPage} // 한 페이지에 보여줄 게시글 개수
                currentPage={currentPage} // 현재 페이지
                setCurrentPage={setCurrentPage} // 페이지 변경 함수
              />
            </div>
          </li>
          <li>
            <h3>Modal</h3>
            <div className={style.box}>
              <ul className={style.btn_ul}>
                <li>
                  <button onClick={() => openModal("alert", "가게 정보를 먼저 등록해 주세요.")}>
                    type "alert" Modal 버튼
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("confirm", "신청을 거절하시겠어요?", TestConfirm)}
                  >
                    type "confirm" Modal 버튼
                  </button>
                </li>
                <li>
                  <button onClick={() => openModal("notice", "비밀번호가 일치하지 않습니다.")}>
                    type "notice" Modal 버튼
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Seung;
