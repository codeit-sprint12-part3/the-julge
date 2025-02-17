import { useRouter } from "next/router";
import styles from "@/pages/my-shop/jobs/[shopId]/[noticeId]/jobs.module.css";
import Title from "@/components/ui/Title";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useAuthUser } from "@/stores/useAuthUser";
import { useEffect, useState } from "react";
import { getShopNotice, updateShopNotice } from "@/lib/notices";
import Modal from "@/components/ui/Modal";
import AuthGuard from "@/components/auth/AuthGuard";

function Page() {

  const router = useRouter();
  const { shopId, noticeId } = router.query;

  const { token, user, fetchAndSetUser } = useAuthUser();
  const [isClient, setIsClient] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalType, setModalType] = useState<"alert" | "confirm" | "notice">("alert");
  const [registeredShopId, setRegisteredShopId] = useState<string | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | undefined>(undefined);

  const [priceData, setPriceData] = useState("");
  const [priceError, setPriceError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState("");

  const [timeData, setTimeData] = useState("");
  const [timeError, setTimeError] = useState("");

  const [descriptionData, setDescriptionData] = useState("");

  // 유저 정보 불러오기
  useEffect(() => {
    setIsClient(true);
    if (token && !user) {
      fetchAndSetUser();
    }
  }, [token, user, fetchAndSetUser]);

  // 공고 데이터 불러오기
  useEffect(() => {
    if (shopId && noticeId) {
      const fetchNotice = async () => {
        try {
          const response = await getShopNotice(shopId as string, noticeId as string);
          const notice = response?.item;
          if (notice) {
            setPriceData(notice.hourlyPay.toLocaleString());

            // ISO 형식을 datetime-local 형식으로 변환
            const startDateTime = new Date(notice.startsAt);
            const formattedStartDate = startDateTime.toISOString().slice(0, 16);
            setStartDate(formattedStartDate);

            setTimeData(notice.workhour.toString());
            setDescriptionData(notice.description);
          }
        } catch (error) {
          setModalType("alert");
          setModalText("공고를 불러오는 데 실패했습니다.");
          setModalOpen(true);
          console.error(error);
        }
      };
      fetchNotice();
    }
  }, [shopId, noticeId]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      value = parseInt(value, 10).toLocaleString();
    }
    setPriceData(value);
    setPriceError("");
  };

  const handleBlurPrice = () => {
    if (!priceData.trim()) {
      setPriceError("금액은 필수 입력 사항입니다.");
      return;
    }

    // 콤마 제거 후 숫자로 변환
    const numericValue = parseInt(priceData.replace(/,/g, ""), 10);
    if (isNaN(numericValue)) {
      setPriceError("유효한 숫자를 입력하세요.");
      return;
    }

    setPriceData(numericValue.toLocaleString());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setStartDate(inputDate);
    setStartDateError("");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setTimeData(value);
    setTimeError("");
  };

  const handleBlurStartDate = () => {
    if (!startDate) {
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

    const hourlyPay = parseInt(priceData.replace(/[^0-9]/g, ""), 10);
    if (hourlyPay < 1000) {
      setPriceError("최저시급 이상으로 입력해주세요.");
      setModalType("alert");
      setModalText("최저시급 이상으로 입력해주세요.");
      setModalOpen(true);
      return;
    }

    if (hourlyPay > 1000000000) {
      setPriceError("시급은 10억 원을 넘을 수 없습니다.");
      setModalType("alert");
      setModalText("시급은 10억 원을 넘을 수 없습니다.");
      setModalOpen(true);
      return;
    }

    if (!startDate) {
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

    const timeNumber = parseInt(timeData, 10);
    if (isNaN(timeNumber) || timeNumber < 1 || timeNumber > 24) {
      setTimeError("올바른 시간을 입력해주세요. 1에서 24시간 사이.");
      setModalType("alert");
      setModalText("올바른 시간을 입력해주세요. 1에서 24시간 사이.");
      setModalOpen(true);
      return;
    }

    // datetime-local에서 가져온 값은 로컬 시간인데, 이를 UTC로 변환해야 합니다.
    const dateTimeParts = startDate.split("-");
    const [year, month, day] = dateTimeParts;

    // UTC로 변환하는 부분
    const formattedStartTime = new Date(Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      timeNumber,
      0,
      0,
      0
    )).toISOString();

    // 과거 시간인지 체크
    const selectedDateTime = new Date(formattedStartTime);
    const currentTime = new Date();

    if (selectedDateTime <= currentTime) {
      setModalType("alert");
      setModalText("시작일시는 현재 시간 이후여야 합니다.");
      setModalOpen(true);
      return;
    }

    const data = {
      hourlyPay: hourlyPay,
      startsAt: formattedStartTime,
      workhour: timeNumber,
      description: descriptionData,
    };

    try {
      const response = await updateShopNotice(shopId as string, noticeId as string, data);
      if (response?.item?.id) {
        setModalType("alert");
        setModalText("공고가 성공적으로 수정되었습니다.");
        setModalOpen(true);
        setRegisteredShopId(response.item.id);
      } else {
        setModalType("alert");
        setModalText("수정된 공고의 ID를 찾을 수 없습니다.");
        setModalOpen(true);
      }
    } catch (error) {
      setModalType("alert");
      setModalText("공고 수정에 실패했습니다. 다시 시도해주세요.");
      setModalOpen(true);
      console.error("error :", error);
    }
  };

  return (
    <div className={styles.announcementContainer}>
      <Title text="공고 수정" />

      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <div className={styles.inputContainer}>
            <label htmlFor="price">
              시급
              <span title="필수입력">*</span>
            </label>
            <div className={styles.inputBox}>
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
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="StartDate">
              시작 일시
              <span title="필수입력">*</span>
            </label>
            <div className={`${styles.inputBox} ${styles.startDateInputBox}`}>
              <Input
                id="StartDate"
                type="datetime-local"
                required={true}
                value={startDate}
                onChange={handleDateChange}
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
                value={timeData}
                onChange={handleTimeChange}
                onBlur={handleBlurTime}
                error={timeError}
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
            value={descriptionData}
            onChange={(e) => setDescriptionData(e.target.value)}
          />
        </div>

        <Button
          buttonText="수정하기"
          size="large"
          styleButton="primary"
          className={styles.regButton}
        />
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (registeredShopId) {
            router.push(`/my-shop/jobs/${shopId}/${registeredShopId}`);
          }
        }}
        type={modalType}
        text={modalText}
        onConfirm={onConfirmCallback}
      />

    </div>
  );
}

export default AuthGuard(Page, "employer");
