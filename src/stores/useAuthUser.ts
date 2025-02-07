import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setToken, getToken, removeToken } from "@/lib/storage";
import { fetchUserInfo } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  type: "employer" | "employee";
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const useAuthUser = create<AuthState>()(
  persist(
    (set) => ({
      token: getToken(),
      user: null,
      login: async (token) => {
        setToken(token);
        const userInfo = await fetchUserInfo(token);
        set({ token, user: userInfo });
      },
      logout: () => {
        removeToken();
        set({ token: null, user: null });
      },
    }),
    { name: "auth-storage" }
  )
);
