import { client } from "@/lib/axiosClient";
import { getCookie } from "@/lib/cookies";

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
export const getUserInfo = async (userId: string) => {
  try {
    const response = await client.get(`/users/${userId}`);
    return response.data;
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
    const response = await client.put(`/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("token")?.value}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
