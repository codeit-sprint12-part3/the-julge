import { useAuthUser } from "@/stores/useAuthUser";

import { getNotices } from "@/lib/notices";
import { NoticeResponse, NoticeWrapper, Filters } from "@/type";
import { useEffect, useState } from "react";
import PostCard from "@/components/ui/PostCard";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import styles from "./DataList.module.css";
import { Icon } from "@/components/icon/Icon";
import Pagination from "@/components/ui/Pagination";
import DetailFilter from "@/components/ui/DetailFilter";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const DataList = () => {
  const { token, user } = useAuthUser();
  const [postAllData, setPostAllData] = useState<NoticeWrapper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortState, setSortState] = useState("마감임박순");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalItems, setTotalItems] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [filter, setFilter] = useState<Filters>({
    selectedAddresses: [],
    startDate: "",
    price: "",
  });
  const [appliedFilter, setAppliedFilter] = useState<Filters>({
    selectedAddresses: [],
    startDate: "",
    price: "",
  });
  const [filterNum, setFilterNum] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const { keyword } = router.query;

  useEffect(() => {
    if (user === undefined) return;
    setIsReady(true);
  }, [user]);

  useEffect(() => {
    if (router.pathname === "/search" && (!router.isReady || !keyword)) return;

    const formattedDate = appliedFilter.startDate
      ? dayjs(appliedFilter.startDate, "YYYY.MM.DD").format("YYYY-MM-DDT00:00:00[Z]")
      : undefined;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const allData: NoticeResponse = await getNotices({
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          sort:
            sortState === "마감임박순"
              ? "time"
              : sortState === "시급많은순"
              ? "pay"
              : sortState === "시간적은순"
              ? "hour"
              : "shop",
          address:
            appliedFilter.selectedAddresses.length > 0
              ? appliedFilter.selectedAddresses
              : undefined,
          keyword: keyword as string, // keyword가 undefined일 가능성 방지
          startsAtGte: formattedDate,
          hourlyPayGte: appliedFilter.price ? Number(appliedFilter.price) : undefined,
        });

        setPostAllData(allData.items || []);
        setTotalItems(allData.count || 0);
      } catch (error) {
        console.error("전체 공고 API 요청 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [router.isReady, currentPage, sortState, appliedFilter, keyword]); // router.isReady 추가

  const sortToggle = () => {
    sortOpen ? setSortOpen(false) : setSortOpen(true);
  };

  const sortSet = (state: string) => {
    setSortState(state);
    setSortOpen(false);
  };

  const onApply = (newFilters: Filters) => {
    setAppliedFilter(newFilters); // 적용 버튼 눌렀을 때만 API 요청 트리거
    setFilterNum(
      newFilters.selectedAddresses.length +
        (newFilters.startDate ? 1 : 0) +
        (newFilters.price ? 1 : 0)
    );
    setFilterOpen(false);
  };

  const filterCount = filterNum > 0 ? ` (${filterNum})` : "";

  return (
    <section className={styles.main_all}>
      {keyword ? (
        <Title
          text={
            <>
              <span>{keyword}</span>에 대한 공고목록
            </>
          }
        />
      ) : (
        <Title text="전체 공고">
          <div className={styles.right}>
            <div className={styles.sort_box}>
              <p onClick={sortToggle}>
                {sortState} <Icon name="selectUp" size={10}></Icon>
              </p>
              {sortOpen && (
                <ul>
                  <li
                    onClick={() => {
                      sortSet("마감임박순");
                    }}
                  >
                    마감임박순
                  </li>
                  <li
                    onClick={() => {
                      sortSet("시급많은순");
                    }}
                  >
                    시급많은순
                  </li>
                  <li
                    onClick={() => {
                      sortSet("시간적은순");
                    }}
                  >
                    시간적은순
                  </li>
                  <li
                    onClick={() => {
                      sortSet("가나다순");
                    }}
                  >
                    가나다순
                  </li>
                </ul>
              )}
            </div>
            <div className={styles.filter}>
              <Button
                buttonText={`상세 필터${filterCount}`}
                styleButton="primary"
                size="small"
                onClick={() => setFilterOpen(!filterOpen)}
              />
              {filterOpen && (
                <DetailFilter
                  onApply={onApply}
                  onClose={() => setFilterOpen(false)}
                  filters={filter} // 현재 필터 값 유지
                  setFilters={setFilter} // DetailFilter 내부에서는 filter만 변경
                />
              )}
            </div>
          </div>
        </Title>
      )}
      {isLoading ? (
        <ul className="post_list">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <li key={index} className="loading_wrap">
              <PostCard isLoading={true} />
            </li>
          ))}
        </ul>
      ) : postAllData.length > 0 ? (
        <ul className="post_list">
          {postAllData.map(({ item }) => {
            if (!item) return null;
            return (
              <li key={item.id}>
                <PostCard data={item} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.no_data}>공고가 없습니다.</p>
      )}
      <div className={styles.page}>
        <Pagination
          currentPage={currentPage}
          totalPosts={totalItems}
          postsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
};
export default DataList;
