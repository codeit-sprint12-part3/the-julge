import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setToken, getToken, removeToken } from "@/lib/storage";
import { fetchUserInfo } from "@/lib/auth";
import { getUserAlerts, markAlertAsRead } from "@/lib/alerts";
import { toast } from "react-toastify";
import { Alert } from "@/components/alerts/AlertsTypes";

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
  user: User | any;
  alerts: Alert[];
  login: (token: string) => Promise<void>;
  logout: () => void;
  fetchAndSetUser: () => Promise<void>;
  fetchAndSetAlerts: () => Promise<void>;
  markAlertAsRead: (alertId: string) => Promise<void>;
}

export const useAuthUser = create<AuthState>()(
  persist(
    (set, get) => ({
      token: getToken(),
      user: null,
      alerts: [],
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
      fetchAndSetAlerts: async () => {
        const { token, user } = get();
        if (!token || !user) return;

        try {
          const response = await getUserAlerts(user.id, 0, 10);
          const unreadAlert = response.items.filter((itemData: any) => !itemData.item.read);
          set({ alerts: unreadAlert });
        } catch (error) {
          console.error("알림 데이터 불러오기 실패:", error);
        }
      },
      markAlertAsRead: async (alertId: string) => {
        const user = get().user;
        if (!user) return;

        try {
          const response = await markAlertAsRead(user.id, alertId);
          console.log(response);

          // set((state) => ({
          //   alerts: state.alerts.filter((alert) => alert.id !== alertId),
          // }));
        } catch (error) {
          console.error("Failed to mark alert as read:", error);
        }
      },
    }),
    { name: "auth-storage" }
  )
);
