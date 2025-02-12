import { client } from "@/lib/axiosClient";
import { getToken } from "@/lib/storage";

// 1. 유저의 알림 목록 조회
const getUserAlerts = async (userId: string, offset = 0, limit = 10) => {
  try {
    const token = getToken();
    if (!token) return;

    const response = await client.get(`/users/${userId}/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { offset, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return null;
  }
};

// 2. 알림 읽음 처리
const markAlertAsRead = async (userId: string, alertId: string) => {
  try {
    const token = getToken();
    if (!token) return;

    await client.put(
      `/users/${userId}/alerts/${alertId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Failed to mark alert as read:", error);
  }
};

export { getUserAlerts, markAlertAsRead };
