export const TOAST_CONFIG = {
  error: {
    bg: "#1A0A0F",
    border: "#6B1A35",
    accent: "#F87171",
    textColor: "#FCA5A5",
  },
  success: {
    bg: "#071811",
    border: "#1A5C35",
    accent: "#34D399",
    textColor: "#6EE7B7",
  },
  info: {
    bg: "#080F1A",
    border: "#1A3A6B",
    accent: "#60A5FA",
    textColor: "#93C5FD",
  },
};

export type ToastType = "success" | "error" | "info";

export type ToastData = {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
};

export type ToastContextValue = {
  toast: (options: Omit<ToastData, "id">) => void;
  showTransactionToast: (params: {
    title: string;
    txSignature: string;
    cluster?: string;
  }) => void;
};
