import {
  CheckCircleIcon,
  InfoIcon,
  XIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  Button,
  ToastProvider as TamaguiToastProvider,
  Toast,
  ToastViewport,
  XStack,
} from "tamagui";

const TOAST_CONFIG = {
  error: {
    bg: "#1A0A0F",
    border: "#6B1A35",
    accent: "#F87171",
    textColor: "#FCA5A5",
    icon: XCircleIcon,
  },
  success: {
    bg: "#071811",
    border: "#1A5C35",
    accent: "#34D399",
    textColor: "#6EE7B7",
    icon: CheckCircleIcon,
  },
  info: {
    bg: "#080F1A",
    border: "#1A3A6B",
    accent: "#60A5FA",
    textColor: "#93C5FD",
    icon: InfoIcon,
  },
};

type ToastType = "success" | "error" | "info";

type ToastData = {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  toast: (options: Omit<ToastData, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = (options: Omit<ToastData, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts([{ duration: 10000, ...options, id }]);
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <TamaguiToastProvider swipeDirection="down">
        {children}

        {toasts.map((t) => {
          const config = TOAST_CONFIG[t.type];
          const Icon = config.icon;

          return (
            <Toast
              key={t.id}
              duration={t.duration}
              onOpenChange={(open) => {
                if (!open) remove(t.id);
              }}
              enterStyle={{ opacity: 0, y: -8, scale: 0.95 }}
              exitStyle={{ opacity: 0, y: -8, scale: 0.95 }}
              opacity={1}
              y={0}
              scale={1}
              transition="quick"
              backgroundColor={config.bg}
              borderWidth={1}
              borderColor={config.border}
              borderLeftWidth={3}
              borderLeftColor={config.accent}
              borderRadius="$4"
              paddingVertical="$3"
              paddingHorizontal="$4"
              paddingRight="$8"
            >
              <XStack
                // alignItems="center"
                gap="$2"
                // marginBottom={t.description ? "$1" : 0}
                verticalAlign="middle"
              >
                <Icon size={18} color={config.accent} weight="fill" />
                <Toast.Title
                  style={{ color: config.textColor }}
                  fontWeight="600"
                  fontSize={15}
                >
                  {t.title}
                </Toast.Title>
              </XStack>

              {t.description && (
                <Toast.Description
                  style={{ color: config.textColor }}
                  fontSize={13}
                  opacity={0.85}
                >
                  {t.description}
                </Toast.Description>
              )}

              <Toast.Close asChild position="absolute" right="$2" top="$2">
                <Button size="$1" chromeless circular>
                  <XIcon color={config.textColor} size={12} />
                </Button>
              </Toast.Close>
            </Toast>
          );
        })}

        <ToastViewport
          position="absolute"
          top="$12"
          left="$4"
          right="$4"
          zIndex={9999}
          alignItems="center"
          gap="$2"
        />
      </TamaguiToastProvider>
    </ToastContext.Provider>
  );
}
