import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setToken, getToken, removeToken } from "@/lib/storage";
import { fetchUserInfo } from "@/lib/auth";
import { toast } from "react-toastify";

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
  fetchAndSetUser: () => Promise<void>;
}

export const useAuthUser = create<AuthState>()(
  persist(
    (set, get) => ({
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
        toast.success("또 만나요 🫶🏻");
      },
      fetchAndSetUser: async () => {
        const { token, user } = get();
        if (!token) return;
        const userInfo = await fetchUserInfo(token);
        set({ user: userInfo });
      },
    }),
    { name: "auth-storage" }
  )
);
