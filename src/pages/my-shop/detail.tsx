import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getShopInfo } from "@/lib/shops";
import { getShopNotice, getShopNotices } from "@/lib/notices";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import style from "./Myshop.module.css";
import MyshopRegInfo from "@/components/my-shop/MyshopRegInfo";
import AuthGuard from "@/components/auth/AuthGuard";
import PostCard from "@/components/ui/PostCard";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

function Page() {
  const router = useRouter();
  const { shopId } = router.query;
  const [shop, setShop] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMoreNotices, setHasMoreNotices] = useState<boolean>(true);

  // 스피너 표시 여부 상태 추가
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  // 로딩 상태가 변경될 때마다 스피너 표시 여부 관리
  useEffect(() => {
    if (loading) {
      setShowSpinner(true); // 로딩 시작 시 스피너 표시
    } else {
      setShowSpinner(false); // 로딩 끝나면 스피너 숨김
    }
  }, [loading]);

  // 가게 정보 가져오기
  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    getShopInfo(shopId as string)
      .then((data) => setShop(data.item))
      .catch((error) => console.error("가게 정보 가져오기 오류:", error))
      .finally(() => setLoading(false));
  }, [shopId]);

  // 공고 목록 가져오기
  useEffect(() => {
    if (!shopId || !hasMoreNotices || loading) return;

    const fetchNotices = async () => {
      setLoading(true);

      try {
        const data = await getShopNotices(shopId as string, {
          offset: (page - 1) * 6,
          limit: 6,
        });

        const detailedNotices = await Promise.all(
          data.items.map(async (notice: any) => {
            const detail = await getShopNotice(shopId as string, notice.item.id);
            return detail.item;
          })
        );

        setNotices((prevNotices) => {
          const newNotices = detailedNotices.filter(
            (notice: any) =>
              !prevNotices.some((prevNotice) => prevNotice.id === notice.id)
          );
          return [...prevNotices, ...newNotices];
        });

        // 공고가 6개 미만일 경우 더 이상 데이터가 없으므로 종료
        if (detailedNotices.length < 6) {
          setHasMoreNotices(false); // 공고가 더 이상 없으면 상태 변경
        }
      } catch (error) {
        console.error("공고 목록 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [shopId, page]);

  // 스크롤 이벤트 핸들러 (window 사용)
  const handleScroll = () => {
    if (loading || !hasMoreNotices) return;  // 더 이상 스크롤 이벤트를 처리하지 않음

    const scrollTop = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    // 끝에 도달한 경우
    if (scrollTop >= documentHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // 스크롤 이벤트 추가 및 제거
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMoreNotices]);

  if (loading && page === 1) {
    return <div className={style.spinner}><SpinnerLoader /></div>;
  }

  if (!shop) {
    return <p>가게 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className={style.myshopContainer}>
      <Title text="가게 상세 정보" />
      <div className={style.myshopDetailContainer}>
        <div className={style.detailImgBox}>
          <img src={shop.imageUrl} alt={shop.name} className={style.shopImage} />
        </div>

        <div className={style.detailTextBox}>
          <span className={style.subText}>{shop.category}</span>
          <h3 className={style.detailTatle}>{shop.name}</h3>
          <address>{shop.address1}</address>
          <p>{shop.description}</p>
          <div className={style.btnBox}>
            <Button
              className={style.detailBtn}
              buttonText="편집하기"
              size="large"
              styleButton="secondary"
              onClick={() => router.push(`/my-shop/edit?shopId=${shopId}`)}
            />
            <Button
              className={style.detailBtn}
              buttonText="공고등록하기"
              size="large"
              styleButton="primary"
              onClick={() => router.push(`/my-shop/jobs/write?shopId=${shopId}`)}
            />
          </div>
        </div>
      </div>

      <div className={style.announcementRegBox}>
        {notices.length > 0 ? (
          <div className={style.noticeBox}>
            <Title text="내가 등록한 공고" />
            <ul className="post_list">
              {notices.map((noticeItem) => (
                <li key={noticeItem.id}>
                  <PostCard data={noticeItem} />
                </li>
              ))}
            </ul>
            {showSpinner && (
              <div className={style.spinner}>
                <SpinnerLoader className={`${style.coustomClass}`} />
              </div>
            )}
          </div>
        ) : (
          <>
            <Title text="등록한 공고" />
            <MyshopRegInfo
              infoText="공고를 등록해 보세요."
              buttonText="공고 등록하기"
              href={`/my-shop/jobs/write?shopId=${shopId}`}
            />
          </>
        )}
      </div>
    </div >
  );
}

export default AuthGuard(Page, "employer");
