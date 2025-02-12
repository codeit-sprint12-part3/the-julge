
import { useState, useEffect } from "react";
import style from "./Myshop.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import CustomFileInput from "@/components/ui/CustomFileInput";
import { useRouter } from "next/router";
import { registerShop } from "@/lib/shops";

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

export default function MyshopReg() {
  const router = useRouter();
  const token = useAuth(); // 토큰 관리
  const [shopName, setShopName] = useState("");
  const [shopClassification, setShopClassification] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [detailShopAddress, setDetailShopAddress] = useState("");
  const [shopImage, setShopImage] = useState<File | null>(null);
  const [shopDescription, setShopDescription] = useState("");
  const [error, setError] = useState<{ [key: string]: string }>({});

  const { shopId } = router.query; // 쿼리에서 shopId 가져오기

  useEffect(() => {
    if (shopId) {
      console.log("shopId 값 확인:", shopId); // shopId가 제대로 받아졌는지 확인
    }
  }, [shopId]);

  // 필드 검증 함수
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "shopName":
        if (!value) {
          return "가게 이름은 필수 입력 항목입니다.";
        }
        break;
      case "shopClassification":
        if (!value) {
          return "가게 분류는 필수 입력 항목입니다.";
        }
        break;
      case "shopAddress":
        if (!value) {
          return "주소는 필수 입력 항목입니다.";
        }
        break;
      case "detailShopAddress":
        if (!value) {
          return "상세주소는 필수 입력 항목입니다.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handleBlur = (field: string, value: string) => {
    const errorMessage = validateField(field, value);
    setError((prevError) => ({
      ...prevError,
      [field]: errorMessage,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // 필수 입력 항목 검증
    if (!shopName) {
      errors.shopName = "가게 이름은 필수 입력 항목입니다.";
      isValid = false;
    }
    if (!shopClassification) {
      errors.shopClassification = "가게 분류는 필수 입력 항목입니다.";
      isValid = false;
    }
    if (!shopAddress) {
      errors.shopAddress = "주소는 필수 입력 항목입니다.";
      isValid = false;
    }
    if (!detailShopAddress) {
      errors.detailShopAddress = "상세주소는 필수 입력 항목입니다.";
      isValid = false;
    }

    setError(errors); // 에러 상태 업데이트
    return isValid;
  };

  // Presigned URL을 생성하여 이미지 업로드
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

  // S3에 이미지를 업로드하는 함수
  const uploadImageToS3 = async (file: File) => {
    try {
      const presignedUrl = await getPresignedUrl(file); // presigned URL 얻기
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type }, // 파일의 MIME 타입을 설정
      });

      console.log("이미지 업로드 성공:", presignedUrl);
      return presignedUrl.split("?")[0]; // 쿼리 파라미터를 제외한 URL 반환
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  // 가게가 이미 등록되어 있는지 확인하는 함수
  const checkIfShopExists = async (shopName: string) => {
    try {
      const response = await axios.get(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops?name=${shopName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.items.length > 0) {
        // 이미 가게가 존재하는 경우
        return true;
      }

      // 가게가 존재하지 않는 경우
      return false;
    } catch (error) {
      console.error("가게 존재 여부 확인 실패:", error);
      return false; // 실패시에는 false로 처리
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const shopExists = await checkIfShopExists(shopName);
    if (shopExists) {
      toast.error("이미 등록된 가게가 있습니다.");
      return;
    }

    try {
      let imageUrl = "";
      if (shopImage) {
        imageUrl = await uploadImageToS3(shopImage); // 이미지 업로드 처리
      }

      const dataToSend = {
        name: shopName,
        category: shopClassification as "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타",
        address1: shopAddress,
        address2: detailShopAddress,
        description: shopDescription,
        imageUrl: imageUrl || "", // 업로드된 이미지 URL
        originalHourlyPay: 9860, // 기본 시급
      };

      const response = await registerShop(dataToSend); // 가게 등록 API 호출

      if (response) {
        toast.success("가게가 등록되었습니다!");
        router.push(`/my-shop/detail?shopId=${response.item.id}`); // 등록 후 상세 페이지로 이동
      }
    } catch (error) {
      toast.error("가게 등록에 실패했습니다.");
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
              onBlur={(e) => handleBlur("shopName", e.target.value)} // 포커스 아웃 시 검증
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
              onChange={setShopClassification}
              value={shopClassification}
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
              onChange={setShopAddress}
              value={shopAddress}
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
              onBlur={(e) => handleBlur("detailShopAddress", e.target.value)} // 포커스 아웃 시 검증
              required
              error={error.detailShopAddress}
            />
          </div>
        </div>

        <div className={style.inputContainer}>
          <div className={style.box}>
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
    </div>
  );
}
