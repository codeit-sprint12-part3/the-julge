import { client } from "@/lib/axiosClient";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  iat: number;
}

export const login = async (email: string, password: string) => {
  const res = await client.post("/token", { email, password });
  return res.data.item.token;
};

export const fetchUserInfo = async (token: string) => {
  const decoded: DecodedToken = jwtDecode(token);
  const res = await client.get(`/users/${decoded.userId}`);
  return res.data.item;
};
