import { authClient } from "@/lib/auth-client";
import { axiosInstance } from "@/lib/axios";
import type {
  DashboardResponse,
  InsightsResponse,
  PeriodTab,
  UserStats,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./key";

export function useUserStats() {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      const res = await axiosInstance.get<UserStats>("/api/user/stats");
      return res.data.data;
    },
    staleTime: 1000 * 30,
    enabled: hasToken,
  });
}
