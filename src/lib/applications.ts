import { client } from "@/lib/axiosClient";
import { getCookie } from "@/lib/cookies";

// 1. 가게의 특정 공고의 지원 목록 조회
export const getApplicationsForNotice = async (
  shopId: string,
  noticeId: string,
  offset?: number,
  limit?: number
) => {
  try {
    const response = await client.get(`/shops/${shopId}/notices/${noticeId}/applications`, {
      params: { offset, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 가게의 특정 공고 지원 등록
export const applyToNotice = async (shopId: string, noticeId: string) => {
  try {
    const response = await client.post(
      `/shops/${shopId}/notices/${noticeId}/applications`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")?.value}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. 가게의 특정 공고 지원 승인, 거절 또는 취소
export const updateApplicationStatus = async (
  shopId: string,
  noticeId: string,
  applicationId: string,
  status: "accepted" | "rejected" | "canceled"
) => {
  try {
    const response = await client.put(
      `/shops/${shopId}/notices/${noticeId}/applications/${applicationId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")?.value}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 4. 유저의 지원 목록 조회
export const getUserApplications = async (userId: string, offset?: number, limit?: number) => {
  try {
    const response = await client.get(`/users/${userId}/applications`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${getCookie("token")?.value}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
