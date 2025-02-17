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
import { registerShop } from "@/lib/shops";
import Modal from "@/components/ui/Modal";
import AuthGuard from "@/components/auth/AuthGuard";

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

  const router = useRouter();
  const token = useAuth(); // 토큰 관리

  type Category = "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타";
  const [shopName, setShopName] = useState("");
  const [shopClassification, setShopClassification] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [detailShopAddress, setDetailShopAddress] = useState("");
  const [shopImage, setShopImage] = useState<File | null>(null);
  const [shopDescription, setShopDescription] = useState("");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const { shopId } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"alert" | "confirm" | "notice">("alert");
  const [modalText, setModalText] = useState("");
  const [registeredShopId, setRegisteredShopId] = useState<string | null>(null);
  const [basicSalary, setBasicSalary] = useState("");

  useEffect(() => {
    if (shopId) {
      console.log("shopId 값 확인:", shopId);
    }
  }, [shopId]);


  const formatCurrency = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const removeCommas = (value: string) => {
    return value.replace(/[^0-9]/g, "");
  };

  const handleBasicSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setBasicSalary(formattedValue);
  };

  const handleBasicSalaryBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = removeCommas(e.target.value);

    const errorMessage = validateField("basicSalary", numericValue);
    setError((prevError) => ({
      ...prevError,
      basicSalary: errorMessage,
    }));

    setBasicSalary(e.target.value);
  };

  // 필드 검증 함수
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "shopName":
        return value ? "" : "가게 이름은 필수 입력 항목입니다.";
      case "shopClassification":
        return value ? "" : "가게 분류는 필수 입력 항목입니다."; // 필수 입력 검사 추가
      case "shopAddress":
        return value ? "" : "주소는 필수 입력 항목입니다."; // 필수 입력 검사 추가
      case "detailShopAddress":
        return value ? "" : "상세주소는 필수 입력 항목입니다.";
      case "basicSalary":
        return value ? "" : "기본 시급은 필수 입력 항목입니다.";
      default:
        return "";
    }
  };

  const handleBlur = (field: string, value: string) => {
    const errorMessage = validateField(field, value);
    setError((prevError) => ({
      ...prevError,
      [field]: errorMessage,
    }));
  };

  // 전체 폼 유효성 검사 함수
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    ["shopName", "shopClassification", "shopAddress", "detailShopAddress", "basicSalary"].forEach((field) => {
      const errorMessage = validateField(field, eval(field));
      if (errorMessage) {
        errors[field] = errorMessage;
        isValid = false;
      }
    });

    setError(errors);
    return isValid;
  };

  const getPresignedUrl = async (file: File) => {
    try {
      const response = await axios.post(
        "https://bootcamp-api.codeit.kr/api/0-1/the-julge/images",
        { name: file.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.item?.url) {
        return response.data.item.url;
      } else {
        throw new Error("Presigned URL 생성 실패");
      }
    } catch (error) {
      console.error("Presigned URL 요청 실패:", error);
      throw error;
    }
  };

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

  const checkIfShopExists = async (shopName: string) => {
    try {
      const response = await axios.get(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops?name=${shopName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.items.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("가게 존재 여부 확인 실패:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const shopExists = await checkIfShopExists(shopName);

    if (shopExists) {
      setModalType("alert");
      setModalText("이미 등록된 가게가 있습니다.");
      setModalOpen(true);
      return;
    }

    try {
      let imageUrl = "";
      if (shopImage) {
        imageUrl = await uploadImageToS3(shopImage);
      }

      const numericSalary = removeCommas(basicSalary);

      const dataToSend = {
        name: shopName,
        category: shopClassification as "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타",
        address1: shopAddress,
        address2: detailShopAddress,
        description: shopDescription,
        imageUrl: imageUrl || "",
        originalHourlyPay: parseInt(numericSalary, 10) || 0,  // Ensure it's a number, default to 0
      };

      const response = await registerShop(dataToSend);

      if (response) {
        setModalType("alert");
        setModalText("가게가 등록되었습니다.");
        setRegisteredShopId(response.item.id);
        setModalOpen(true);
      }
    } catch (error) {
      setModalType("alert");
      setModalText("가게 등록에 실패했습니다.");
      setModalOpen(true);
      console.error("Error registering shop:", error);
    }
  };

  return (
    <div className={style.myshopContainer}>
      <Title text="가게 정보" />
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
              <em title="필수 입력">*</em>
            </span>

            <CustomSelect
              menuItems={categoryOptions}
              type="button"
              onChange={(value) => {
                setShopClassification(value as Category);
                handleBlur("shopClassification", value);  // 유효성 검사 추가
              }}
              value={shopClassification}
              error={error.shopClassification} // error prop 전달
              onBlur={(e) => handleBlur("shopClassification", shopClassification)}  // onBlur 수정
            />
          </div>
        </div>

        <div className={style.inputContainer}>
          <div className={style.box}>
            <span className={style.labelText}>
              주소
              <em title="필수 입력">*</em>
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
              id="BasicSalary"
              type="text"
              placeholder="입력"
              value={basicSalary}
              onChange={handleBasicSalaryChange}
              onBlur={handleBasicSalaryBlur}
              required
              error={error.basicSalary}
              subText="원"
            />
          </div>
        </div>

        <div className={style.inputContainer}>
          <div className={`${style.box} ${style.fileBox}`}>
            <CustomFileInput
              label="가게 사진 업로드"
              id="ShopImage"
              onFileChange={setShopImage}
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
          buttonText="등록하기"
          size="large"
          styleButton="primary"
          className={style.regBtn}
          type="submit"
        />
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (registeredShopId) {
            router.push(`/my-shop/detail?shopId=${registeredShopId}`);
          }
        }}
        type={modalType}
        text={modalText}
      />
    </div>
  );
}

export default AuthGuard(Page, "employer");
