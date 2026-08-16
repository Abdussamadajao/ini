import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  message: string;
  type?: ToastType;
  actionText?: string;
  onActionPress?: () => void;
  duration?: number;
  position?: "top" | "bottom" | "center";
};

type ShorthandOpts = Omit<ToastItem, "id" | "type" | "message">;

interface ToastState {
  toasts: ToastItem[];
  push: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  push: (item) =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now().toString(), ...item }],
    })),

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}));

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const push = useToastStore((s) => s.push);
  const dismiss = useToastStore((s) => s.dismiss);
  const clear = useToastStore((s) => s.clear);

  const make = (type: ToastType) => (message: string, opts?: ShorthandOpts) =>
    push({ message, type, ...opts });

  const toast = {
    success: make("success"),
    error: make("error"),
    warning: make("warning"),
    info: make("info"),
  };

  return { toast, dismiss, clear };
}
