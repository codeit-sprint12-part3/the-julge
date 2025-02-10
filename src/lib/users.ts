import { client } from "@/lib/axiosClient";
import { getToken } from "@/lib/storage";

// 1. 회원가입
export const registerUser = async (data: {
  email: string;
  password: string;
  type: "employee" | "employer";
}) => {
  try {
    const response = await client.post("/users", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 내 정보 조회
export const getUserInfo = async (userId?: string) => {
  try {
    const token = getToken();
    const response = await client.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.item;
  } catch (error) {
    throw error;
  }
};

// 3. 내 정보 수정
export const updateUserInfo = async (
  userId: string,
  data: { name: string; phone: string; address: string; bio: string }
) => {
  try {
    const token = getToken();
    const response = await client.put(`/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
