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
  const router = useRouter();
  const token = useAuth();

  const [shopName, setShopName] = useState("");
  console.log(shopName)
  const [shopClassification, setShopClassification] = useState<Category>("한식");
  const [shopAddress, setShopAddress] = useState("");
  const [detailShopAddress, setDetailShopAddress] = useState("");
  const [shopImage, setShopImage] = useState<File | null>(null);
  const [shopDescription, setShopDescription] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // 이미지 URL 상태 추가
  const { shopId } = router.query;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalType, setModalType] = useState<"alert" | "confirm" | "notice">("alert");
  const [registeredShopId, setRegisteredShopId] = useState<string | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | undefined>(undefined);

  //가게 데이터 불러오기
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
            setCurrentImageUrl(shop.imageUrl || ""); // 이미지 URL 설정
          }
        } catch (error) {
          setModalType("alert");
          setModalText("가게정보를 불러오는 데 실패했습니다.");
          setModalOpen(true);
          console.error("error:", error);
        }
      };
      fetchNotice()
    }
  }, [shopId]);

  const validateForm = () => {
    if (!shopName || !shopClassification || !shopAddress || !detailShopAddress || !shopDescription) {
      toast.error("모든 필드를 올바르게 입력해주세요.");
      return false;
    }
    return true;
  };

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
      toast.error("이미지 업로드 URL 생성 실패");
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
      return presignedUrl.split("?")[0]; // Query String 제거 후 반환
    }
    catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let imageUrl = "";
      if (shopImage) {
        imageUrl = await uploadImageToS3(shopImage);
      }

      const dataToSend = {
        name: shopName,
        category: shopClassification,
        address1: shopAddress,
        address2: detailShopAddress,
        description: shopDescription,
        imageUrl: imageUrl || currentImageUrl, // 이미지 URL 업데이트
        originalHourlyPay: 9860, // 최저 시급 예시
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
              onChange={(e) => setShopName(e.target.value)} required
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
              onChange={(selectedValue: string) => setShopClassification(selectedValue as Category)}
              value={shopClassification}
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
              onChange={(e) => setDetailShopAddress(e.target.value)} required
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
            />
            {/* {currentImageUrl && (
              <img src={currentImageUrl} alt="가게이미지" className={style.img} />
            )} */}
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
        onConfirm={onConfirmCallback} // Pass the callback to the modal
      />

    </div>
  );
}

export default AuthGuard(Page, "employer");