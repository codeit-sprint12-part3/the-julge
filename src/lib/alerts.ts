import { client } from "@/lib/axiosClient";
import { getToken } from "@/lib/storage";

// 1. 유저의 알림 목록 조회
export const getUserAlerts = async (userId: string, offset?: number, limit?: number) => {
  try {
    const token = getToken();
    const response = await client.get(`/users/${userId}/alerts`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 알림 읽음 처리
export const markAlertAsRead = async (userId: string, alertId: string) => {
  try {
    const token = getToken();
    const response = await client.put(
      `/users/${userId}/alerts/${alertId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
