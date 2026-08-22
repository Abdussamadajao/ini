import { formatPrice } from "@/lib/custom";
import { MaterialIcons } from "@expo/vector-icons";
import { clsx, type ClassValue } from "clsx";
import { startOfDay, subDays } from "date-fns";

export function isValidMaterialIcon(
  name: string,
): name is keyof typeof MaterialIcons.glyphMap {
  return name in MaterialIcons.glyphMap;
}

export function getSectionLabel(date: Date): string {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  const d = startOfDay(date);
  if (d.getTime() === today.getTime()) return "TODAY";
  if (d.getTime() === yesterday.getTime()) return "YESTERDAY";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAmount(amount: number, isIncome: boolean): string {
  const sign = isIncome ? "+ " : "- ";
  return sign + formatPrice(Math.abs(amount));
}

export function getToday(): Date {
  return startOfDay(new Date());
}

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// utils/compactTimeAgo.ts (new file)
export function compactTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay < 7) return `${diffDay}d`;
  return `${diffWeek}w`;
}
