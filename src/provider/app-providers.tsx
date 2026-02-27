import { tamaguiConfig } from "@/src/config/tamagui";
import { getSolanaNetwork } from "@/src/helpers/misc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import { FontsProvider } from "./font-provider";
import { NetworkProvider } from "./network-provider";
import { ToastProvider } from "./toast-provider";
import { TokenProvider } from "./token-provider";
import { TransferInputProvider } from "./transfer-input-provider";
import { MobileWalletProvider } from "@wallet-ui/react-native-kit";
import { APP_IDENTITY } from "../constants";

const queryClient = new QueryClient();
const network = getSolanaNetwork();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FontsProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <NetworkProvider network={network}>
              <MobileWalletProvider cluster={network} identity={APP_IDENTITY}>
                <TokenProvider>
                  <TransferInputProvider>{children}</TransferInputProvider>
                </TokenProvider>
              </MobileWalletProvider>
            </NetworkProvider>
          </QueryClientProvider>
        </ToastProvider>
      </TamaguiProvider>
    </FontsProvider>
  );
}
