import { X } from "phosphor-react-native";
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  Button,
  ToastProvider as TamaguiToastProvider,
  Text,
  Toast,
  ToastViewport,
} from "tamagui";

type ToastType = "success" | "error" | "info";

type ToastData = {
  id: string;
  type: ToastType;
  title: string;
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
          const bgColor =
            t.type === "error"
              ? "#2B0010"
              : t.type === "success"
              ? "#0A2B08"
              : "#0A2B5D";

          const textColor =
            t.type === "error"
              ? "#EFB2CE"
              : t.type === "success"
              ? "#84E76F"
              : "#B2D4FF";

          return (
            <Toast
              key={t.id}
              bg={bgColor}
              rounded="$4"
              p="$4"
              position="relative"
              duration={t.duration}
              onOpenChange={(open) => {
                if (!open) remove(t.id);
              }}
              boxShadow="0px 2px 4px rgba(0,0,0,0.18), 0px 8px 24px rgba(0,0,0,0.11)"
            >
              <Toast.Title>
                <Text color={textColor} fontWeight={500} fontSize={"$4"}>
                  {t.title}
                </Text>
              </Toast.Title>

              {t.description && (
                <Toast.Description mt={"$1"}>
                  <Text color={textColor} fontSize={"$2"}>
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
                  <X color={textColor} size={14} />
                </Button>
              </Toast.Close>
            </Toast>
          );
        })}

        <ToastViewport
          position={"absolute"}
          bottom={"$3"}
          right={"$3"}
          zIndex={9999}
          padding="$3"
        />
      </TamaguiToastProvider>
    </ToastContext.Provider>
  );
}
