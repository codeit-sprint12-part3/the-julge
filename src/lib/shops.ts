import { client } from "@/lib/axiosClient";
import { getCookie } from "@/lib/cookies";

// 1. 가게 등록
export const registerShop = async (data: {
  name: string;
  category: "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타";
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}) => {
  try {
    const response = await client.post("/shops", data, {
      headers: {
        Authorization: `Bearer ${getCookie("token")?.value}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 가게 정보 조회
export const getShopInfo = async (shopId: string) => {
  try {
    const response = await client.get(`/shops/${shopId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. 가게 정보 수정
export const updateShopInfo = async (
  shopId: string,
  data: {
    name: string;
    category: "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타";
    address1: string;
    address2: string;
    description: string;
    imageUrl: string;
    originalHourlyPay: number;
  }
) => {
  try {
    const response = await client.put(`/shops/${shopId}`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("token")?.value}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
