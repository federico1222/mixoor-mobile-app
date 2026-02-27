import { isSolanaError } from "@solana/kit";
import * as Clipboard from "expo-clipboard";
import { useCallback, useState } from "react";
import { formatAddress } from "../helpers";
import { getSolanaClusterId } from "../helpers/misc";
import type { UserToken } from "../provider";
import { useToast } from "../provider/toast-provider";
import { depositFromBE } from "../services/deposit.service";
import { directTransferFromBE } from "../services/transfer.service";
import type { MultiRecipient, TransferInput, TransferType } from "../types";
import { useSignIn } from "./useAuthenticate";
import { useDeposit, type DepositResult } from "./useProgramIxs";
import { useUserPreviousTransfers } from "./userUser";

type TransferParams = {
  uiAmount: string;
  recipientAddress: string;
  selectedToken: UserToken;
  userAddress: string;
  isMultipleWallets: boolean;
  transferInput?: TransferInput[];
  transferType: TransferType;
};

type RetryTransferParams = {
  userAddress: string;
  amount: string;
  secret: string;
  nullifier: string;
  commitment: string;
  recipient: string;
  displayAmount: number;
  selectedToken: UserToken;
  txSignature: string;
  isMultipleWallets: boolean;
  transferInput?: TransferInput[];
  transferType: TransferType;
  multiRecipients?: MultiRecipient[];
};

function clipAddress(addr: string) {
  return formatAddress(addr, 0, 4, 4) ?? addr;
}

export const useTransferWithToasts = () => {
  const { deposit, isLoading } = useDeposit();
  const { refetch } = useUserPreviousTransfers();
  const { toast, showTransactionToast } = useToast();
  const { signIn } = useSignIn();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRetryLoading, setIsRetryLoading] = useState(false);
  const [lastTransferData, setLastTransferData] =
    useState<RetryTransferParams | null>(null);

  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    const isAuthenticated = await signIn();
    if (!isAuthenticated) {
      toast({
        type: "error",
        title: "Authentication Failed",
        description:
          "Please sign the authentication message to continue. If the prompt didn't appear, try reconnecting your wallet.",
        duration: 8000,
      });
      return false;
    }
    return true;
  }, [signIn, toast]);

  const retryTransfer = useCallback(
    async (retryParams?: RetryTransferParams) => {
      setIsRetryLoading(true);
      const paramsToUse = retryParams ?? lastTransferData;

      if (!paramsToUse) {
        setIsRetryLoading(false);
        return;
      }

      if (!(await checkAuthentication())) {
        setIsRetryLoading(false);
        return;
      }

      const {
        selectedToken,
        userAddress,
        amount,
        secret,
        nullifier,
        commitment,
        recipient,
        displayAmount,
        txSignature,
        transferType,
        multiRecipients,
      } = paramsToUse;

      toast({
        type: "info",
        title: `Retrying ${
          transferType === "delayed" ? "deposit" : "transfer"
        }`,
        description: "Processing retry transaction...",
      });

      try {
        const response = await directTransferFromBE({
          userAddress,
          mint: selectedToken.mintAddress,
          amount,
          secret,
          nullifier,
          commitment,
          decimals: selectedToken.decimals,
          recipient,
          tokenProgram: selectedToken.tokenProgram,
          txSignature,
          transferType,
          multiRecipients,
        });

        if (!response.success) {
          setError(true);
          setSuccess(false);
          toast({
            type: "error",
            title: `${
              transferType === "delayed" ? "Deposit" : "Transfer"
            } Failed`,
            description:
              response.message ?? "An error occurred during the transfer",
            action: {
              label: "Copy error",
              onPress: () =>
                Clipboard.setStringAsync(
                  response.message ?? "An error occurred during the transfer"
                ),
            },
          });
          return;
        }

        setSuccess(true);
        setError(false);
        toast({
          type: "success",
          title: `${
            transferType === "delayed" ? "Deposit" : "Transfer"
          } Completed`,
          description: `Sent ${displayAmount} ${
            selectedToken.symbol
          } to ${clipAddress(recipient)}`,
        });
      } catch (err) {
        console.log("Error retrying transfer:", err);
        setError(true);
        setSuccess(false);
        toast({
          type: "error",
          title: `${
            transferType === "delayed" ? "Deposit" : "Transfer"
          } Failed`,
          description:
            err instanceof Error ? err.message : "Unknown error occurred",
          action: {
            label: "Copy error",
            onPress: () =>
              Clipboard.setStringAsync(
                err instanceof Error
                  ? `${err.message}\n${err.stack ?? ""}`
                  : String(err)
              ),
          },
        });
      } finally {
        setIsRetryLoading(false);
        refetch();
      }
    },
    [lastTransferData, refetch, checkAuthentication, toast]
  );

  const handleTransfer = useCallback(
    async ({
      uiAmount,
      recipientAddress,
      selectedToken,
      userAddress,
      transferType,
    }: TransferParams) => {
      setSuccess(false);
      setError(false);

      if (!(await checkAuthentication())) return;

      toast({
        type: "info",
        title: `Processing ${
          transferType === "delayed" ? "deposit" : "transfer"
        }`,
        description: "Sending transaction and waiting for confirmation…",
      });

      const handleTransferError = (
        description: string,
        retryData?: RetryTransferParams,
        errorToCopy?: unknown
      ) => {
        setError(true);
        setSuccess(false);
        if (retryData) setLastTransferData(retryData);

        const errorText =
          errorToCopy instanceof Error
            ? `${errorToCopy.message}\n${errorToCopy.stack ?? ""}`
            : String(errorToCopy ?? description);

        toast({
          type: "error",
          title: `${
            transferType === "delayed" ? "Deposit" : "Transfer"
          } Failed`,
          description,
          duration: 100000,
          action: {
            label: "Copy error",
            onPress: () => Clipboard.setStringAsync(errorText),
          },
        });
      };

      try {
        const depositResult: DepositResult = await deposit();

        showTransactionToast({
          title: "Transaction Sent",
          txSignature: depositResult.txSignature as string,
          cluster: getSolanaClusterId(),
        });

        if (depositResult.isMultipleWallets) {
          const { txSignature, recipients } = depositResult;
          const totalAmount = recipients.reduce(
            (sum, r) => sum + BigInt(r.amount),
            0n
          );

          const retryData: RetryTransferParams = {
            userAddress,
            amount: totalAmount.toString(),
            secret: recipients[0]?.secret ?? "",
            nullifier: recipients[0]?.nullifier ?? "",
            commitment: recipients[0]?.commitment ?? "",
            recipient: recipientAddress,
            displayAmount: Number(uiAmount),
            selectedToken,
            txSignature,
            isMultipleWallets: true,
            transferType,
            multiRecipients: recipients,
          };

          const response = await directTransferFromBE({
            userAddress,
            mint: selectedToken.mintAddress,
            amount: totalAmount.toString(),
            secret: recipients[0]?.secret ?? "",
            nullifier: recipients[0]?.nullifier ?? "",
            commitment: recipients[0]?.commitment ?? "",
            decimals: selectedToken.decimals,
            recipient: recipientAddress,
            tokenProgram: selectedToken.tokenProgram,
            txSignature,
            multiRecipients: recipients,
            transferType,
          });

          if (!response?.success) {
            handleTransferError(
              response.message ?? "An error occurred during the transfer",
              retryData,
              response.message
            );
            return;
          }

          setSuccess(true);
          setError(false);
          toast({
            type: "success",
            title: `${
              transferType === "delayed" ? "Deposit" : "Transfer"
            } Completed`,
            description: `Sent ${uiAmount} ${selectedToken.symbol} to ${recipients.length} wallets`,
          });
        } else {
          const { txSignature, scaledAmount, secret, nullifier, commitment } =
            depositResult;

          const retryData: RetryTransferParams = {
            userAddress,
            amount: scaledAmount.toString(),
            secret,
            nullifier,
            commitment,
            recipient: recipientAddress,
            displayAmount: Number(uiAmount),
            selectedToken,
            txSignature,
            isMultipleWallets: false,
            transferType,
          };

          const response =
            transferType === "direct"
              ? await directTransferFromBE({
                  userAddress,
                  mint: selectedToken.mintAddress,
                  amount: scaledAmount.toString(),
                  secret,
                  nullifier,
                  commitment,
                  decimals: selectedToken.decimals,
                  recipient: recipientAddress,
                  tokenProgram: selectedToken.tokenProgram,
                  txSignature,
                  transferType,
                })
              : await depositFromBE({
                  amount: scaledAmount.toString(),
                  commitment,
                  userAddress,
                  secret,
                  nullifier,
                  txSignature,
                  mint: selectedToken.mintAddress,
                  decimals: selectedToken.decimals,
                  tokenProgram: selectedToken.tokenProgram,
                });

          if (!response?.success) {
            handleTransferError(
              response.message ?? `An error occurred during the transfer`,
              retryData
            );
            return;
          }

          setSuccess(true);
          setError(false);

          toast({
            type: "success",
            title: `${
              transferType === "delayed" ? "Deposit" : "Transfer"
            } Completed`,
            description:
              transferType === "delayed"
                ? "Deposit successful. You can send your deposit any time"
                : `Sent ${uiAmount} ${selectedToken.symbol} to ${clipAddress(
                    recipientAddress
                  )}`,
          });
        }
      } catch (err) {
        console.log("⚠️ Please share the error below with the dev team ⚠️");
        console.log("Error Type:", isSolanaError(err) ? "Solana" : "General");
        console.log(err);
        handleTransferError(
          err instanceof Error ? err.message : "Unknown error occurred",
          undefined,
          err
        );
      } finally {
        refetch();
      }
    },
    [checkAuthentication, deposit, toast, refetch]
  );

  return {
    handleTransfer,
    retryTransfer,
    lastTransferData,
    isRetryLoading,
    isLoading,
    success,
    error,
    setError,
    setSuccess,
  };
};
