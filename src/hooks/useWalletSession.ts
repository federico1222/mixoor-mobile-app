import { useQueryClient } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useEffect, useRef } from "react";
import { logout } from "../services/auth.service";

/**
 * Manages wallet session lifecycle for mobile:
 * - Clears queries and auth when wallet disconnects
 */
export function useWalletSession() {
  const queryClient = useQueryClient();
  const { account } = useMobileWallet();

  const prevAddressRef = useRef<string | undefined>(undefined);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const currentAddress = account?.address.toString();

    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevAddressRef.current = currentAddress;
      return;
    }

    const invalidateAuthQueries = () => {
      queryClient.invalidateQueries({ queryKey: ["startAuthMessage"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      queryClient.invalidateQueries({ queryKey: ["userTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["userDeposits"] });
    };

    // Wallet disconnected
    if (prevAddressRef.current && !currentAddress) {
      console.log("Wallet disconnected, logging out...");

      logout()
        .catch((err) => console.log("Error logging out:", err))
        .finally(() => {
          invalidateAuthQueries();
        });
    }

    prevAddressRef.current = currentAddress;
  }, [account, queryClient]);
}
