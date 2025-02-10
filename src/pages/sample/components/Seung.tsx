import { useEffect, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import PostCard from "@/components/ui/PostCard";
import style from "./Seung.module.css";
import { useModal } from "@/context/ModalContext";
import Table from "@/components/ui/Table";
import { toast } from "@/pages/_app";
import { getNotices } from "@/lib/notices";
import { NoticeResponse, NoticeWrapper } from "@/type";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";

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

  // --------------------------------------------------------
  // ----------------- PostCard 관련 Start -------------------
  const [postData, setPostData] = useState<NoticeWrapper[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: NoticeResponse = await getNotices({});
        console.log(data);
        setPostData(data.items || []);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);
  // ----------------- PostCard 관련 End ---------------------
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
          <li>
            <h3>Table</h3>
            <div className={style.box}>
              <Table />
            </div>
          </li>
          <li>
            <h3>Toast</h3>
            <div className={style.box}>
              <ul className={style.btn_ul}>
                <li>
                  <button onClick={() => toast("거절 했어요.")}>Toast 팝업!</button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <h3>PostCard</h3>
            <div className={style.box}>
              <ul className="post_list">
                {postData.map(({ item }) => {
                  if (!item) return null;
                  return (
                    <li key={item.id}>
                      <PostCard data={item} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
          <li>
            <h3>Title</h3>
            <div className={style.box}>
              <h3>1. 일반 타이틀</h3>
              <Title text="공고목록" />
              <h3>2. 하이라이트 타이틀 (span태그에 하이라이트 부분 감싸기)</h3>
              <Title
                text={
                  <>
                    <span>맛집</span>에 대한 공고목록
                  </>
                }
              />
              <h3>3. 우측 컨텐츠 타이틀 (children에 우측 영역 추가)</h3>
              <Title text="공고목록">
                <Button buttonText="상세필터" type="button" size="small" styleButton="primary" />
              </Title>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Seung;
