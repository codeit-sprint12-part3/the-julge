import { client } from "./axiosClient";
import { setCookie, removeCookie } from "./cookies";

interface LoginResponse {
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await client.post<LoginResponse>("/api/login", { email, password });

    if (res.data.token) {
      setCookie("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logout = () => {
  removeCookie("token");
};
