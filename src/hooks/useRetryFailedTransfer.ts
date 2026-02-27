import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useState } from "react";
import { sparsedTransferFromBE } from "../services/transfer.service";
import { PreviousPrivateTransferLogs } from "../types/user";

export function useRetryFailedTransfer(onSuccess?: () => void) {
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const { account } = useMobileWallet();

  const handleRetry = async (item: PreviousPrivateTransferLogs) => {
    if (!account || !item.errorRecipientAddress) return;

    setRetryingId(item.depositId);
    try {
      const response = await sparsedTransferFromBE({
        userAddress: account.address,
        depositId: Number(item.depositId),
        recipientAddress: item.errorRecipientAddress,
      });

      if (response.success) {
        onSuccess?.();
      } else {
        console.log("Retry transfer failed:", response);
      }
    } catch (error) {
      console.log("Retry transfer error:", error);
    } finally {
      setRetryingId(null);
    }
  };

  const isFailedTransfer = (item: PreviousPrivateTransferLogs) =>
    Boolean(
      (item.errorReason || item.errorRecipientAddress) && !item.isErrorResolved
    );

  return {
    retryingId,
    handleRetry,
    isFailedTransfer,
  };
}
