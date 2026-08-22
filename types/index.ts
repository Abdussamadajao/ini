import { MaterialIcons } from "@expo/vector-icons";

export * from "./auth";
export * from "./categories";
export * from "./country";
export * from "./dashboard";
export * from "./error";
export * from "./insights";
export * from "./transactions";
export * from "./user";
export * from "./budgets";
export * from "./notification";
// Export the SourceItem type to match your data structure
export type SourceItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap | string;
  categoryId?: string;
  remaining: number;
  total: number;
  spent?: number;
  color?: string;
};
