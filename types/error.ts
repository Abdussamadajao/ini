export interface VariantMeta {
  emoji: string;
  title: string;
  message: string;
  bg: string;
}

export type ErrorVariant =
  | "generic"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "server";
