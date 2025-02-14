import styles from "./DetailTopBox.module.css";
import { getShopNotice } from "@/lib/notices";
import { NoticeWrapper } from "@/type";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Icon } from "@/components/icon/Icon";
import { useRouter } from "next/router";
import { useAuthUser } from "@/stores/useAuthUser";
import { applyToNotice, getUserApplications, updateApplicationStatus } from "@/lib/applications";
import { useModal } from "@/context/ModalContext";
import { toast } from "@/pages/_app";

const DetailTopBox = () => {
  const router = useRouter();
  const [postData, setPostData] = useState<NoticeWrapper>();
  const { openModal, closeModal } = useModal();
  const [statusText, setStatusText] = useState("");
  const [shopId, setShopId] = useState<string | null>(null);
  const [noticeId, setNoticeId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { token, user, logout, fetchAndSetUser } = useAuthUser();

  // 유저 정보 불러오기 [시작]
  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser();
    }
  }, [token, user, fetchAndSetUser]);
  // 유저 정보 불러오기 [종료]

  useEffect(() => {
    if (router.isReady) {
      setShopId((router.query.shopId as string) ?? null);
      setNoticeId((router.query.noticeId as string) ?? null);
    }
  }, [router.isReady, router.query.shopId, router.query.noticeId]);

  // 공고 데이터 불러오기 [시작]
  useEffect(() => {
    const fetchData = async () => {
      if (!shopId || !noticeId) return;
      try {
        const data = await getShopNotice(shopId as string, noticeId as string);
        setPostData(data);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };
    fetchData();
  }, [shopId, noticeId]);
  // 공고 데이터 불러오기 [종료]

  // 공고 시작 시간 포맷팅 [시작]
  const formatStartsAt = dayjs(postData?.item.startsAt);
  const formatted = `${formatStartsAt.format("YYYY-MM-DD HH:mm")}~${formatStartsAt
    .add(postData?.item.workhour as number, "hour")
    .format("HH:mm")} (${postData?.item.workhour}시간)`;
  // 공고 시작 시간 포맷팅 [종료]

  // 마감 여부 및 지난 공고 여부 확인 [시작]
  const closed = postData?.item.closed;
  const isPast = dayjs().isAfter(formatStartsAt) && !closed;
  useEffect(() => {
    if (!postData) return;
    const formatStartsAt = dayjs(postData?.item.startsAt);
    const isPast = dayjs().isAfter(formatStartsAt) && !postData?.item.closed;
    const closed = postData?.item.closed;
    setStatusText(closed ? "마감 완료" : isPast ? "지난공고" : "");
  }, [postData]);
  // 마감 여부 및 지난 공고 여부 확인 [종료]

  // 유저의 지원 여부 확인 [시작]
  const fetchUserApplications = async () => {
    if (!user?.id || !token) return;
    try {
      const data = await getUserApplications(user.id);
      const application = data.items.find(
        (app: any) =>
          app.item.notice.item.id === postData?.item.id && app.item.status !== "canceled"
      );
      setHasApplied(!!application);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (user?.id && token && postData?.item.id) {
      fetchUserApplications();
    }
  }, [user?.id, token, postData?.item.id]);
  // 유저의 지원 여부 확인 [종료]

  const HandelEmployer = () => {
    openModal("alert", "사장님은 공고에 신청할 수 없어요.");
  };

  // 알바생의 프로필 여부 확인 [시작]
  const hasProfile = user?.type === "employee" && user?.address ? true : false;

  const handleGoToProfile = () => {
    const onConfirm = () => {
      closeModal();
      router.push("/user/edit");
    };
    openModal(
      "confirm",
      "내 프로필을 먼저 등록해 주세요. \n프로필 등록 페이지로 이동하시겠습니까?",
      onConfirm
    );
  };
  // 알바생의 프로필 여부 확인 [종료]

  // 로그인 여부 확인 [시작]
  const isLoggedIn = !!token;
  const handleGoToLogin = () => {
    const onConfirm = () => {
      closeModal();
      router.push("/auth/login");
    };
    openModal("confirm", "로그인이 필요합니다. \n로그인 페이지로 이동하시겠습니까?", onConfirm);
  };
  // 로그인 여부 확인 [종료]

  // 공고 지원하기 [시작]
  const handleApply = async () => {
    if (!postData || !user?.id || !token) return;

    const onConfirm = async () => {
      try {
        closeModal();
        await applyToNotice(postData.item.shop.item.id, postData.item.id);
        toast("신청이 완료되었습니다.");
        await fetchUserApplications();
      } catch (error) {
        console.error(error);
        toast("신청 중 오류가 발생했습니다.");
      }
    };

    openModal("confirm", `'${postData?.item.shop.item.name}'에 신청하시겠어요?`, onConfirm);
  };
  // 공고 지원하기 [종료]

  // 공고 지원 취소하기 [시작]
  const handleCancel = async () => {
    if (!postData || !user?.id || !token) return;

    const onConfirm = async () => {
      try {
        closeModal();
        const data = await getUserApplications(user.id);
        const application = data.items.find(
          (app: any) =>
            app.item.notice.item.id === postData.item.id && app.item.status !== "canceled"
        );
        if (!application) {
          toast("이미 취소된 신청입니다.");
          return;
        }
        await updateApplicationStatus(
          postData.item.shop.item.id,
          postData.item.id,
          application.item.id,
          "canceled"
        );
        toast("신청이 취소되었습니다.");
        await fetchUserApplications();
      } catch (error) {
        console.error(error);
        toast("취소 중 오류가 발생했습니다.");
      }
    };
    openModal("confirm", `'${postData?.item.shop.item.name}'에 신청을 취소하시겠어요?`, onConfirm);
  };

  // 공고 지원 취소하기 [종료]

  // 버튼 렌더링 [시작]
  const [buttonText, setButtonText] = useState("신청 불가");
  const [buttonStyle, setButtonStyle] = useState<"primary" | "secondary">("primary");
  const [buttonAction, setButtonAction] = useState<(() => void) | undefined>(undefined);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (!isClient) return;

    if (router.pathname === "/my-shop/jobs/[shopId]/[noticeId]") {
      setButtonText("공고 편집하기");
      setButtonStyle("secondary");
      setButtonDisabled(false);
      setButtonAction(() => () => router.push(`/my-shop/jobs/${shopId}/${noticeId}/edit`));
    } else {
      if (closed || isPast) {
        setButtonText("신청 불가");
        setButtonDisabled(true);
      } else if (!isLoggedIn) {
        setButtonText("신청하기");
        setButtonDisabled(false);
        setButtonAction(() => handleGoToLogin);
      } else if (user?.type === "employer") {
        setButtonText("신청하기");
        setButtonDisabled(false);
        setButtonAction(() => HandelEmployer);
      } else if (!hasProfile) {
        setButtonText("신청하기");
        setButtonDisabled(false);
        setButtonAction(() => handleGoToProfile);
      } else if (hasApplied) {
        setButtonText("취소하기");
        setButtonStyle("secondary");
        setButtonDisabled(false);
        setButtonAction(() => handleCancel);
      } else {
        setButtonText("신청하기");
        setButtonStyle("primary");
        setButtonDisabled(false);
        setButtonAction(() => handleApply);
      }
    }
  }, [isClient, closed, isPast, isLoggedIn, user, hasProfile, hasApplied]);

  const button = (
    <Button
      buttonText={buttonText}
      size="large"
      styleButton={buttonStyle}
      onClick={buttonAction}
      disabled={buttonDisabled}
    />
  );
  // 버튼 렌더링 [종료]

  return (
    <section className={styles.view_content}>
      <div className={styles.category}>{postData?.item.shop.item.category}</div>
      <Title text={postData?.item.shop.item.name} />
      <div className={`${styles.box} ${closed ? styles.end : ""} ${isPast ? styles.end : ""}`}>
        <div className={styles.thumbnail}>
          <span className={styles.end}>{statusText}</span>
          <img src={postData?.item.shop.item.imageUrl} alt={postData?.item.shop.item.name} />
        </div>
        <div className={styles.content}>
          <p>시급</p>
          <div className={styles.price}>
            <p>{postData?.item.hourlyPay.toLocaleString()}원</p>
            <Badge
              type="increased"
              hourlyPay={postData?.item.hourlyPay}
              originalHourlyPay={postData?.item.shop.item.originalHourlyPay}
            />
          </div>
          <ul>
            <li>
              <Icon name="time" color="var(--red-200)" />
              <span>{formatted}</span>
            </li>
            <li>
              <Icon name="map" color="var(--red-200)" />
              <span>{postData?.item.shop.item.address1}</span>
            </li>
          </ul>
          <div className={styles.txt}>
            <p>{postData?.item.shop.item.description}</p>
          </div>
          {button}
        </div>
      </div>
      <div className={styles.description}>
        <h3>공고 설명</h3>
        <p>{postData?.item.description}</p>
      </div>
    </section>
  );
};
export default DetailTopBox;
