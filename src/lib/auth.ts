import { client } from "@/lib/axiosClient";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string; // 사용자 ID
  iat: number; // 발급 시간
}

export const login = async (email: string, password: string) => {
  const res = await client.post("/token", { email, password });
  return res.data.item.token;
};

export const fetchUserInfo = async (token: string) => {
  // const userId = JSON.parse(atob(token.split(".")[1])).userId;
  const decoded: DecodedToken = jwtDecode(token); // JWT 디코딩
  const res = await client.get(`/users/${decoded.userId}`);
  return res.data.item;
};
