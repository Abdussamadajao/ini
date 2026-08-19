import { authClient } from "@/lib/auth-client";
import { axiosInstance } from "@/lib/axios";
import type { DashboardResponse, InsightsResponse, PeriodTab } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./key";

// Maps UI tab labels to the query param sent to the backend.
// I have NOT confirmed the backend reads this param yet — see note below.
const PERIOD_PARAM_MAP: Record<PeriodTab, string> = {
  Week: "week",
  Month: "month",
  "3M": "3m",
  Year: "year",
};

export function useDashboard(period: PeriodTab = "Month") {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: dashboardKeys.summary(period),
    queryFn: async () => {
      const res = await axiosInstance.get<DashboardResponse>(
        "/api/dashboard/summary",
        { params: { period: PERIOD_PARAM_MAP[period] } },
      );
      return res.data.data;
    },
    staleTime: 1000 * 30,
    enabled: hasToken,
  });
}

export function useInsights() {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: dashboardKeys.insights(),
    queryFn: async () => {
      const res = await axiosInstance.get<InsightsResponse>("/api/insights");
      return res.data.data;
    },
    staleTime: 1000 * 30,
    enabled: hasToken,
  });
}
