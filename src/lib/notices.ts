import { client } from "@/lib/axiosClient";
import { getToken } from "@/lib/storage";

// 1. 공고 목록 조회
export const getNotices = async (params: {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: "time" | "pay" | "hour" | "shop";
}) => {
  try {
    const response = await client.get("/notices", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 가게의 공고 목록 조회
export const getShopNotices = async (
  shopId: string,
  params: { offset?: number; limit?: number }
) => {
  try {
    const response = await client.get(`/shops/${shopId}/notices`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. 가게 공고 등록
export const createShopNotice = async (
  shopId: string | string[] | undefined,
  data: {
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
  }
) => {
  try {
    const token = getToken();
    const response = await client.post(`/shops/${shopId}/notices`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 4. 가게의 특정 공고 조회
export const getShopNotice = async (shopId: string, noticeId: string) => {
  try {
    const response = await client.get(`/shops/${shopId}/notices/${noticeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 5. 가게의 특정 공고 수정
export const updateShopNotice = async (
  shopId: string,
  noticeId: string,
  data: {
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
  }
) => {
  try {
    const token = getToken();
    const response = await client.put(`/shops/${shopId}/notices/${noticeId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
