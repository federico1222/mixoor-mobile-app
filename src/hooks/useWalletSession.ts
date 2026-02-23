import { useMobileWallet } from "@/src/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { logout } from "../services/auth.service";

/**
 * Manages wallet session lifecycle for mobile:
 * - Clears queries and auth when wallet disconnects
 */
export function useWalletSession() {
  const { isConnected } = useMobileWallet();
  const queryClient = useQueryClient();

  const prevConnectedRef = useRef<boolean>(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip on first mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevConnectedRef.current = isConnected;
      return;
    }

    const invalidateAuthQueries = () => {
      queryClient.invalidateQueries({ queryKey: ["startAuthMessage"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      queryClient.invalidateQueries({ queryKey: ["userTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["userDeposits"] });
    };

    // Wallet disconnected
    if (prevConnectedRef.current && !isConnected) {
      console.log("Wallet disconnected, logging out...");

      // Clear auth token from AsyncStorage
      AsyncStorage.removeItem("mwa_auth_token").catch((err) =>
        console.error("Error clearing auth token:", err)
      );

      logout()
        .catch((err) => console.error("Error logging out:", err))
        .finally(() => {
          invalidateAuthQueries();
        });
    }

    prevConnectedRef.current = isConnected;
  }, [isConnected, queryClient]);
}
