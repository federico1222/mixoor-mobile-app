import { tamaguiConfig } from "@/src/config/tamagui";
import { MobileWalletProvider } from "@/src/context/MobileWalletProvider";
import {
  FontsProvider,
  ToastProvider,
  TransferInputProvider,
} from "@/src/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <FontsProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <MobileWalletProvider>
              <TransferInputProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#090b0b" },
                  }}
                />
              </TransferInputProvider>
            </MobileWalletProvider>
          </QueryClientProvider>
        </ToastProvider>
      </TamaguiProvider>
    </FontsProvider>
  );
}
