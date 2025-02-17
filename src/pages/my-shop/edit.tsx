import { useState, useEffect } from "react";
import style from "./Myshop.module.css";
import axios from "axios";
import CustomSelect from "@/components/ui/CustomSelect";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import CustomFileInput from "@/components/ui/CustomFileInput";
import { useRouter } from "next/router";
import { getShopInfo, updateShopInfo } from "@/lib/shops";
import AuthGuard from "@/components/auth/AuthGuard";
import Modal from "@/components/ui/Modal";


// 서울시 구 목록
const addressOptions = [
  "서울시 종로구", "서울시 중구", "서울시 용산구", "서울시 성동구", "서울시 광진구",
  "서울시 동대문구", "서울시 중랑구", "서울시 성북구", "서울시 강북구", "서울시 도봉구",
  "서울시 노원구", "서울시 은평구", "서울시 서대문구", "서울시 마포구", "서울시 양천구",
  "서울시 강서구", "서울시 구로구", "서울시 금천구", "서울시 영등포구", "서울시 동작구",
  "서울시 관악구", "서울시 서초구", "서울시 강남구", "서울시 송파구", "서울시 강동구"
];

// 가게 분류 목록
const categoryOptions = ["한식", "중식", "일식", "양식", "분식", "카페", "편의점", "기타"];

type Category = "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타";

function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return token;
}

function Page() {

  // 기본 시급 에러 상태 추가
  const [error, setError] = useState({
    shopName: "",
    shopAddress: "",
    detailShopAddress: "",
    baseHourlyPay: "",  // 에러 상태 추가
    shopDescription: "",
    shopClassification: "",
  });

  // 기본 시급 유효성 검사 수정
  const handleBaseHourlyPayBlur = () => {
    if (!baseHourlyPay) {
      setError((prevState) => ({
        ...prevState,
        baseHourlyPay: "기본 시급은 필수 입력 항목입니다.",  // 에러 메시지 업데이트
      }));
    } else {
      setError((prevState) => ({
        ...prevState,
        baseHourlyPay: "",  // 에러 메시지 초기화
      }));
    }
  };

  // 유효성 검사 함수 수정
  const handleBlur = (field: string, value: string) => {
    const newErrorState = { ...error };
    switch (field) {
      case "shopName":
        newErrorState.shopName = value ? "" : "가게 이름은 필수 입력 항목입니다.";
        break;
      case "shopAddress":
        newErrorState.shopAddress = value ? "" : "주소는 필수 입력 항목입니다.";
        break;
      case "detailShopAddress":
        newErrorState.detailShopAddress = value ? "" : "상세주소는 필수 입력 항목입니다.";
        break;
      case "baseHourlyPay":
        newErrorState.baseHourlyPay = value ? "" : "기본 시급은 필수 입력 항목입니다.";
        break;
      case "shopClassification":
        newErrorState.shopClassification = value ? "" : "가게 분류는 필수 입력 항목입니다.";
        break;
      default:
        break;
    }
    setError(newErrorState);
  };

  const router = useRouter();
  const token = useAuth();
  const [baseHourlyPay, setBaseHourlyPay] = useState<number>();
  const [shopName, setShopName] = useState("");
  const [shopClassification, setShopClassification] = useState<Category>("한식");
  const [shopAddress, setShopAddress] = useState("");
  const [detailShopAddress, setDetailShopAddress] = useState("");
  const [shopImage, setShopImage] = useState<File | null>(null);
  const [shopDescription, setShopDescription] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const { shopId } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalType, setModalType] = useState<"alert" | "confirm" | "notice">("alert");
  const [registeredShopId, setRegisteredShopId] = useState<string | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | undefined>(undefined);

  // 가게 데이터 불러오기
  useEffect(() => {
    if (shopId) {
      const fetchNotice = async () => {
        try {
          const response = await getShopInfo(shopId as string);
          const shop = response?.item;
          if (shop) {
            setShopName(shop.name);
            setShopClassification(shop.category as Category);
            setShopAddress(shop.address1);
            setDetailShopAddress(shop.address2);
            setShopDescription(shop.description);
            setCurrentImageUrl(shop.imageUrl || "");
            setBaseHourlyPay(shop.originalHourlyPay || 0);  // 기본 시급을 받아오기
          }
        } catch (error) {
          setModalType("alert");
          setModalText("가게정보를 불러오는 데 실패했습니다.");
          setModalOpen(true);
          console.error("error:", error);
        }
      };
      fetchNotice();
    }
  }, [shopId]);

  // 유효성 검사 함수
  const validateForm = () => {
    const errorMessages: string[] = [];

    if (!shopName || !shopClassification || !shopAddress || !detailShopAddress || !baseHourlyPay) {
      errorMessages.push("필수 입력 항목을 입력해주세요.");
    }

    if (errorMessages.length > 0) {
      setModalType("alert");
      setModalText(errorMessages.join("\n"));
      setModalOpen(true);
      return false;
    }

    return true;
  };

  // Presigned URL 생성
  const getPresignedUrl = async (file: File) => {
    try {
      const response = await axios.post(
        "https://bootcamp-api.codeit.kr/api/0-1/the-julge/images",
        { name: file.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data.item?.url) {
        return response.data.item.url;
      } else {
        throw new Error("Presigned URL 생성 실패");
      }
    } catch (error) {
      console.error("Presigned URL 요청 실패:", error);
      setModalType("alert");
      setModalText("이미지 업로드 URL 생성 실패");
      setModalOpen(true);
      throw error;
    }
  };

  // 이미지 업로드 S3
  const uploadImageToS3 = async (file: File) => {
    try {
      const presignedUrl = await getPresignedUrl(file);
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      console.log("이미지 업로드 성공:", presignedUrl);
      return presignedUrl.split("?")[0];
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  // 기본 시급 변경
  const handleBaseHourlyPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = value ? Number(value) : 0;
    setBaseHourlyPay(numericValue);
  };

  // 기본 시급 포맷
  const formatBaseHourlyPay = (value: number) => {
    return value.toLocaleString();
  };

  // 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // validateForm이 모달을 띄운 후 리턴
    }

    try {
      let imageUrl = "";
      if (shopImage) {
        imageUrl = await uploadImageToS3(shopImage);
      }

      const dataToSend = {
        name: shopName,
        category: shopClassification as "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타",
        address1: shopAddress,
        address2: detailShopAddress,
        description: shopDescription,
        imageUrl: imageUrl || "",
        originalHourlyPay: parseInt(baseHourlyPay?.toString() || "0", 10) || 0,
      };

      const response = await updateShopInfo(shopId as string, dataToSend);

      if (response) {
        setModalType("alert");
        setModalText("가게정보가 성공적으로 수정되었습니다.");
        setModalOpen(true);
        setRegisteredShopId(response.item.id);
      } else {
        setModalType("alert");
        setModalText("공고 수정에 실패했습니다. 다시 시도해주세요.");
        setModalOpen(true);
      }
    } catch (error) {
      setModalType("alert");
      setModalText("공고 수정에 실패했습니다. 다시 시도해주세요.");
      setModalOpen(true);
      console.error("error:", error);
    }
  };

  return (
    <div className={`${style.myshopContainer} ${style.myshopEditContainer}`}>
      <Title text="가게 수정" />
      <form onSubmit={handleSubmit} className={style.myshopForm}>
        <div className={style.inputContainer}>
          <div className={style.box}>
            <Input
              label="가게 이름"
              id="ShopName"
              type="text"
              placeholder="입력"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              onBlur={(e) => handleBlur("shopName", e.target.value)}
              required
              error={error.shopName}
            />
          </div>

          <div className={style.box}>
            <span className={style.labelText}>
              분류
              <em title="필수 입력">
                *
              </em>
            </span>
            <CustomSelect
              menuItems={categoryOptions}
              type="button"
              onChange={(value) => {
                setShopClassification(value as Category);
                handleBlur("shopClassification", value);  // 유효성 검사 추가
              }}
              value={shopClassification}
              error={error.shopClassification}
              onBlur={(e) => handleBlur("shopClassification", shopClassification)}  // onBlur 수정
            />
          </div>
        </div>

        <div className={style.inputContainer}>
          <div className={style.box}>
            <span className={style.labelText}>
              주소
              <em title="필수 입력">
                *
              </em>
            </span>
            <CustomSelect
              menuItems={addressOptions}
              type="button"
              onChange={(value) => {
                setShopAddress(value);
                handleBlur("shopAddress", value);  // 유효성 검사 추가
              }}
              value={shopAddress}
              error={error.shopAddress}
              onBlur={(e) => handleBlur("shopAddress", shopAddress)}  // onBlur 수정
            />
          </div>
          <div className={style.box}>
            <Input
              label="상세주소"
              id="DetailedAddress"
              type="text"
              placeholder="입력"
              value={detailShopAddress}
              onChange={(e) => setDetailShopAddress(e.target.value)}
              onBlur={(e) => handleBlur("detailShopAddress", e.target.value)}
              required
              error={error.detailShopAddress}
            />
          </div>
        </div>

        <div className={style.inputContainer}>
          <div className={style.box}>
            <Input
              label="기본 시급"
              id="BaseHourlyPay"
              type="text"
              placeholder="입력"
              value={baseHourlyPay ? formatBaseHourlyPay(baseHourlyPay) : ''}
              onChange={handleBaseHourlyPayChange}
              required
              subText="원"
              onBlur={handleBaseHourlyPayBlur}  // onBlur 수정
              error={error.baseHourlyPay}  // 에러 메시지 전달
            />
          </div>
        </div>

        <div className={style.inputContainer}>
          <div className={`${style.box} ${style.fileBox} ${style.fileEditBox}`}>
            <CustomFileInput
              label="가게 이미지"
              id="ShopImage"
              onFileChange={setShopImage}
              text="이미지 변경하기"
              styleClass="customStyle"
              currentImageUrl={currentImageUrl}
            />
          </div>
        </div>

        <Textarea
          label="가게 설명"
          placeholder="입력"
          value={shopDescription}
          onChange={(e) => setShopDescription(e.target.value)}
        />

        <Button
          buttonText="완료하기"
          size="large"
          styleButton="primary"
          className={style.regBtn}
          type="submit"
        />
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          if (registeredShopId) {
            router.push(`/my-shop/detail?shopId=${registeredShopId}`);
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
