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

export default function MyshopEdit() {
  const router = useRouter();
  const token = useAuth();

  const [shopName, setShopName] = useState("");
  const [shopClassification, setShopClassification] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [detailShopAddress, setDetailShopAddress] = useState("");
  const [shopImage, setShopImage] = useState<File | null>(null);
  const [shopDescription, setShopDescription] = useState("");
  const { shopId } = router.query; // 쿼리에서 shopId 가져오기

  useEffect(() => {
    if (shopId) {
      // Fetch the shop details when the component mounts
      fetchShopDetails(shopId as string);
    }
  }, [shopId]);

  const fetchShopDetails = async (shopId: string) => {
    try {
      const response = await axios.get(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/${shopId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const shopData = response.data.item;
      setShopName(shopData.name);
      setShopClassification(shopData.category);
      setShopAddress(shopData.address1);
      setDetailShopAddress(shopData.address2);
      setShopDescription(shopData.description);
      // 이미지 URL도 설정하려면 여기에서 처리
    } catch (error) {
      toast.error("가게 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching shop details:", error);
    }
  };

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
        imageUrl: imageUrl || null,
        originalHourlyPay: 9860, // 최저 시급 예시
      };

      const response = await axios.put(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/${shopId}`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast.success("가게 정보가 수정되었습니다!");
        router.push(`/my-shop/detail?shop_id=${shopId}`);
      } else {
        toast.error("가게 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      toast.error("가게 정보 수정에 실패했습니다.");
      console.error("Error editing shop:", error);
    }
  };

  return (
    <div className={`${style.myshopContainer} ${style.myshopEditContainer}`}>
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
              onChange={setShopClassification}
              value={shopClassification} />
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
          <div className={style.box}>
            <CustomFileInput
              label="가게 이미지"
              id="ShopImage"
              onFileChange={setShopImage}
              text="이미지 변경하기"
              styleClass="customStyle"
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
    </div>
  );
}
