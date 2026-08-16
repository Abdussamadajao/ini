import { authClient } from "@/lib/auth-client";
import { axiosInstance } from "@/lib/axios";
import type { DashboardResponse, InsightsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  insights: () => [...dashboardKeys.all, "insights"] as const,
};

export function useDashboard() {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      const res = await axiosInstance.get<DashboardResponse>(
        "/api/dashboard/summary",
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
