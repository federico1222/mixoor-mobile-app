import { useState } from "react";
import { useMobileWallet } from "../context";
import { sparsedTransferFromBE } from "../services/transfer.service";
import { PreviousPrivateTransferLogs } from "../types/user";

export function useRetryFailedTransfer(onSuccess?: () => void) {
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const { address: selectedWalletAccount } = useMobileWallet();

  const handleRetry = async (item: PreviousPrivateTransferLogs) => {
    if (!selectedWalletAccount || !item.errorRecipientAddress) return;

    setRetryingId(item.depositId);
    try {
      const response = await sparsedTransferFromBE({
        userAddress: selectedWalletAccount,
        depositId: Number(item.depositId),
        recipientAddress: item.errorRecipientAddress,
      });

      if (response.success) {
        onSuccess?.();
      } else {
        console.error("Retry transfer failed:", response);
      }
    } catch (error) {
      console.error("Retry transfer error:", error);
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
