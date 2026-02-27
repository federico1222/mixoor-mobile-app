import { TOAST_CONFIG, ToastContextValue, ToastData } from "@/src/types/toast";
import {
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from "phosphor-react-native";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { Linking } from "react-native";
import {
  Button,
  ToastProvider as TamaguiToastProvider,
  Text,
  Toast,
  ToastViewport,
  useWindowDimensions,
  XStack,
} from "tamagui";

const TOAST_ICONS = {
  error: XCircleIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
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

  const { width } = useWindowDimensions();
  const toastWidth = width - 32;

  const toast = (options: Omit<ToastData, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { duration: 10000, ...options, id }]);
  };

  const showTransactionToast = ({
    title,
    txSignature,
    cluster,
    duration = 100000,
  }: {
    title: string;
    txSignature: string;
    cluster?: string;
    duration?: number;
  }) => {
    const clusterParam = cluster
      ? `?cluster=${cluster.replace("solana:", "")}`
      : "";
    const solscanUrl = `https://solscan.io/tx/${txSignature}${clusterParam}`;

    toast({
      type: "success",
      title,
      action: {
        label: "Solscan",
        onPress: () => Linking.openURL(solscanUrl),
      },
      duration: duration,
    });
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, showTransactionToast }}>
      <TamaguiToastProvider swipeDirection="down">
        {children}

        {toasts.map((t) => {
          const config = TOAST_CONFIG[t.type];
          const Icon = TOAST_ICONS[t.type];

          return (
            <Toast
              key={t.id}
              width={toastWidth}
              alignSelf="center"
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
              borderRadius="$4"
              paddingVertical="$3"
              paddingHorizontal="$4"
              paddingRight="$8"
            >
              <XStack gap="$2" verticalAlign="middle">
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

              {t.action && (
                <Toast.Description fontSize={13}>
                  {t.type !== "error" && "View on "}
                  <Text
                    style={{
                      color: config.accent,
                      textDecorationLine: "underline",
                    }}
                    fontSize={13}
                    onPress={t.action.onPress}
                  >
                    {t.action.label}
                  </Text>
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
          width={"100%"}
          position="absolute"
          top="$9"
          zIndex={9999}
        />
      </TamaguiToastProvider>
    </ToastContext.Provider>
  );
}
