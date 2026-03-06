import { TOAST_CONFIG, ToastContextValue, ToastData } from "@/src/types/toast";
import {
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from "phosphor-react-native";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Linking,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack } from "tamagui";

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

function ToastItem({
  data,
  onRemove,
  width,
}: {
  data: ToastData;
  onRemove: (id: string) => void;
  width: number;
}) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(-8));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onRemove(data.id));
  }, [data.id, onRemove, opacity, translateY]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(dismiss, data.duration ?? 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const config = TOAST_CONFIG[data.type];
  const Icon = TOAST_ICONS[data.type];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          width,
          opacity,
          transform: [{ translateY }],
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}
    >
      <XStack gap="$2" verticalAlign="middle">
        <Icon size={18} color={config.accent} weight="fill" />
        <Text
          style={{ color: config.textColor }}
          fontWeight="600"
          fontSize={15}
          shrink={1}
        >
          {data.title}
        </Text>
      </XStack>

      {data.description && (
        <Text
          style={{ color: config.textColor }}
          fontSize={13}
          opacity={0.85}
        >
          {data.description}
        </Text>
      )}

      {data.action && (
        <Pressable onPress={data.action.onPress} hitSlop={8}>
          <Text fontSize={13} style={{ color: config.textColor }}>
            {data.type !== "error" && "View on "}
            <Text
              fontSize={13}
              style={{
                color: config.accent,
                textDecorationLine: "underline",
              }}
            >
              {data.action.label}
            </Text>
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={dismiss}
        style={styles.closeButton}
        hitSlop={8}
      >
        <XIcon color={config.textColor} size={12} />
      </Pressable>
    </Animated.View>
  );
}

/**
 * Renders active toasts. Place inside RN Modal components
 * so toasts appear above modal content.
 */
export function ToastOverlay() {
  const ctx = useContext(ToastContext);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const toastWidth = width - 32;

  if (!ctx) return null;

  const { _toasts, _remove } = ctx;
  if (!_toasts || _toasts.length === 0) return null;

  return (
    <View
      style={[styles.toastContainer, { top: insets.top + 12 }]}
      pointerEvents="box-none"
    >
      {_toasts.map((t) => (
        <ToastItem key={t.id} data={t} onRemove={_remove} width={toastWidth} />
      ))}
    </View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const toastWidth = width - 32;

  const toast = useCallback((options: Omit<ToastData, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { duration: 10000, ...options, id }]);
  }, []);

  const showTransactionToast = useCallback(
    ({
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
        duration,
      });
    },
    [toast]
  );

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showTransactionToast, _toasts: toasts, _remove: remove }}>
      {children}

      {toasts.length > 0 && (
        <View
          style={[
            styles.toastContainer,
            { top: insets.top + 12 },
          ]}
          pointerEvents="box-none"
        >
          {toasts.map((t) => (
            <ToastItem
              key={t.id}
              data={t}
              onRemove={remove}
              width={toastWidth}
            />
          ))}
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 8,
    zIndex: 999999,
    elevation: 999,
  },
  toast: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 36,
    gap: 4,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
