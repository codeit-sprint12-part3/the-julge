import AuthGuard from "@/components/auth/AuthGuard";
import styles from "@/pages/my-shop/jobs/[shopId]/[noticeId]/jobs.module.css";
import Title from "@/components/ui/Title";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useAuthUser } from "@/stores/useAuthUser";
import { useEffect, useState } from "react";
import { createShopNotice } from "@/lib/notices";
import { useRouter } from "next/router";
import Modal from "@/components/ui/Modal";

function Page() {

  const router = useRouter();
  const { shopId } = router.query;

  const { token, user, logout, fetchAndSetUser } = useAuthUser();
  const [isClient, setIsClient] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"alert" | "confirm" | "notice">("alert");
  const [modalText, setModalText] = useState("");
  const [registeredShopId, setRegisteredShopId] = useState<string | null>(null);

  // 유저 정보 불러오기
  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser();
    }
  }, [token, user, fetchAndSetUser]);

  // 금액 상태관리
  const [priceData, setPriceData] = useState("");
  const [priceError, setPriceError] = useState("");

  // 시작일시 상태관리 (날짜와 시간)
  const [startDateTime, setStartDateTime] = useState("");
  const [startDateError, setStartDateError] = useState("");

  // 시간 상태관리 
  const [timeData, setTimeData] = useState("");
  const [timeError, setTimeError] = useState("");

  // 공고 설명 상태관리
  const [descriptionData, setDescriptionData] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setPriceData(formattedValue);
    setPriceError("");  // 에러 초기화
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDateTime = e.target.value;
    setStartDateTime(inputDateTime);
    setStartDateError("");  // 에러 초기화
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setTimeData(value);
    setTimeError("");
  };

  const handleBlurPrice = () => {
    if (!priceData) {
      setPriceError("금액은 필수 입력 사항입니다.");
    }
  };

  const handleBlurStartDate = () => {
    if (!startDateTime) {
      setStartDateError("시작일시는 필수 입력 사항입니다.");
    }
  };

  const handleBlurTime = () => {
    if (!timeData) {
      setTimeError("시간은 필수 입력 사항입니다.");
      return;
    }

    const timeNumber = parseInt(timeData, 10);

    if (isNaN(timeNumber)) {
      setTimeError("올바른 시간을 입력해주세요.");
      return;
    }

    if (timeNumber < 1 || timeNumber > 24) {
      setTimeError("시간은 1에서 24시간 사이로 입력해주세요.");
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    if (!priceData) {
      setPriceError("금액은 필수 입력 사항입니다.");
      isValid = false;
    }

    if (!startDateTime) {
      setStartDateError("시작일시는 필수 입력 사항입니다.");
      isValid = false;
    }

    if (!timeData) {
      setTimeError("시간은 필수 입력 사항입니다.");
      isValid = false;
    }

    if (!isValid) {
      setModalType("alert");
      setModalText("필수입력 사항을 입력해주세요.");
      setModalOpen(true);
      return;
    }

    const hourlyPay = parseInt(priceData.replace(/,/g, ''), 10);

    if (hourlyPay < 1000) {
      setPriceError("최저시급 이상으로 입력해주세요.");
      setModalType("alert");
      setModalText("최저시급 이상으로 입력해주세요.");
      setModalOpen(true);
      return;
    }

    if (hourlyPay > 1000000000) {
      setPriceError("시급은 1,000,000,000원을 넘을 수 없습니다.");
      setModalType("alert");
      setModalText("시급은 1,000,000,000원을 넘을 수 없습니다.");
      setModalOpen(true);
      return;
    }

    const timeNumber = parseInt(timeData, 10);
    if (isNaN(timeNumber) || timeNumber < 1 || timeNumber > 24) {
      setTimeError("올바른 시간을 입력해주세요. 1에서 24시간 사이.");
      setModalType("alert");
      setModalText("올바른 시간을 입력해주세요. 1에서 24시간 사이.");
      setModalOpen(true);
      return;
    }

    const selectedDateTime = new Date(startDateTime);
    const currentTime = new Date();
    if (selectedDateTime <= currentTime) {
      setModalType("alert");
      setModalText("시작일시는 현재 시간 이후여야 합니다.");
      setModalOpen(true);
      return;
    }

    const data = {
      hourlyPay: hourlyPay,
      startsAt: selectedDateTime.toISOString(),
      workhour: timeNumber,
      description: descriptionData,
    };

    try {
      const response = await createShopNotice(shopId, data);
      if (response?.item?.id) {
        setModalType("alert");
        setModalText("공고가 성공적으로 등록되었습니다.");
        setModalOpen(true);
        setRegisteredShopId(response.item.id);

      } else {
        setModalType("alert");
        setModalText("등록된 공고의 ID를 찾을 수 없습니다.");
        setModalOpen(true);
      }
    } catch (error) {
      setModalType("alert");
      setModalText("공고 등록에 실패했습니다. 다시 시도해주세요.");
      setModalOpen(true);
    }
  };

  return (
    <div className={styles.announcementContainer}>
      <Title text="공고 등록" />

      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <div className={styles.inputContainer}>
            <label htmlFor="price">
              시급
              <span title="필수입력">*</span>
            </label>

            <Input
              id="price"
              type="text"
              required={true}
              value={priceData}
              onChange={handlePriceChange}
              onBlur={handleBlurPrice}
              error={priceError}
              subText="원"
            />

          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="StartDateTime">
              시작 일시
              <span title="필수입력">*</span>
            </label>
            <div className={styles.startDateInputBox}>
              <Input
                id="StartDateTime"
                type="datetime-local" // 날짜와 시간 모두 선택 가능
                required={true}
                value={startDateTime}
                onChange={handleDateTimeChange}
                onBlur={handleBlurStartDate}
                error={startDateError}
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="time">
              업무 시간
              <span title="필수입력">*</span>
            </label>
            <div className={styles.inputBox}>
              <Input
                id="time"
                type="text"
                required={true}
                onChange={handleTimeChange}
                onBlur={handleBlurTime}  // onBlur 이벤트 추가
                error={timeError}  // 에러 메시지 전달
                subText="시간"
              />
            </div>
          </div>
        </div>

        <div className={styles.TextareaBox}>
          <Textarea
            label="공고 설명"
            id="description"
            className={styles.Textarea}
            onChange={(e) => setDescriptionData(e.target.value)}
          />
        </div>

        <Button
          buttonText="등록하기"
          size="large"
          styleButton="primary"
          className={styles.regButton}
        />
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          if (registeredShopId) {
            router.push(`/my-shop/jobs/${shopId}/${registeredShopId}`);
          }
        }}
        type={modalType}
        text={modalText}
      />

    </div>
  );
}

export default AuthGuard(Page, "employer");
