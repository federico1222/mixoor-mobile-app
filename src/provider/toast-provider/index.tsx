import {
  CheckCircleIcon,
  InfoIcon,
  X,
  XCircleIcon,
} from "phosphor-react-native";
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  Button,
  ToastProvider as TamaguiToastProvider,
  Text,
  Toast,
  ToastViewport,
  XStack,
} from "tamagui";

const TOAST_CONFIG = {
  error: {
    bg: "#2B0010",
    textColor: "#EFB2CE",
    icon: XCircleIcon,
  },
  success: {
    bg: "#0A2B08",
    textColor: "#84E76F",
    icon: CheckCircleIcon,
  },
  info: {
    bg: "#0A2B5D",
    textColor: "#B2D4FF",
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

    setToasts((prev) => [...prev, { id, ...options }]);
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
              width={"100%"}
              key={t.id}
              style={{
                backgroundColor: config.bg,
                borderLeftColor: config.textColor,
              }}
              rounded="$3"
              p="$4"
              border="1px solid"
              position="relative"
              duration={t.duration}
              onOpenChange={(open) => {
                if (!open) remove(t.id);
              }}
              boxShadow="0px 2px 4px rgba(0,0,0,0.18), 0px 8px 24px rgba(0,0,0,0.11)"
            >
              <Toast.Title>
                <XStack items={"center"} gap={"$2"}>
                  <Icon
                    size={22}
                    color={config.textColor}
                    weight="fill"
                    style={{ marginBottom: 3 }}
                  />

                  <Text
                    style={{ color: config.textColor }}
                    fontWeight={600}
                    fontSize={"$4"}
                  >
                    {t.title}
                  </Text>
                </XStack>
              </Toast.Title>

              {t.description && (
                <Toast.Description mt={"$1"}>
                  <Text style={{ color: config.textColor }} fontSize={"$2"}>
                    {t.description}
                  </Text>
                </Toast.Description>
              )}

              <Toast.Close
                asChild
                position={"absolute"}
                right={"$3"}
                top={"$3"}
              >
                <Button size="$2" bg="transparent">
                  <X color={config.textColor} size={14} />
                </Button>
              </Toast.Close>
            </Toast>
          );
        })}

        <ToastViewport
          position={"absolute"}
          bottom={"$3"}
          zIndex={9999}
          padding="$3"
        />
      </TamaguiToastProvider>
    </ToastContext.Provider>
  );
}
