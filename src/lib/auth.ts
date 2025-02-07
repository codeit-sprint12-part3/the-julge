import { client } from "@/lib/axiosClient";

export const login = async (email: string, password: string) => {
  const res = await client.post("/token", { email, password });
  return res.data.item.token;
};

export const fetchUserInfo = async (token: string) => {
  const userId = JSON.parse(atob(token.split(".")[1])).userId; // JWT 디코딩
  const res = await client.get(`/users/${userId}`);
  return res.data.item;
};
