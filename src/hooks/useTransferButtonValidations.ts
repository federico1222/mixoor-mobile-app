import { isAddress } from "@solana/kit";
import { useMemo } from "react";
import { useMobileWallet } from "../context";
import { scaleToUIAmount } from "../helpers/calculations";
import { useTokenSelection, useTransferInput } from "../provider";

export function useTransferButtonValidations(
  success?: boolean,
  error?: boolean
) {
  const { address: selectedWalletAccount } = useMobileWallet();

  const {
    address: recipientAddress,
    isMultipleWallets,
    transferInput,
    uiAmount,
    transferType,
  } = useTransferInput();

  const { selectedToken } = useTokenSelection();

  /** -------------------------
   * Balance
   * ------------------------ */
  const availableBalanceUi = useMemo(() => {
    if (!selectedToken) return 0;

    return Number(
      scaleToUIAmount(selectedToken.balance, selectedToken.decimals ?? 0)
    );
  }, [selectedToken]);

  const hasInsufficientBalance = availableBalanceUi <= 0;

  /** -------------------------
   * Amount
   * ------------------------ */
  const totalUiAmount = useMemo(() => {
    if (isMultipleWallets) {
      return (
        transferInput?.reduce(
          (sum, input) => sum + Number(input.uiAmount || 0),
          0
        ) ?? 0
      );
    }

    return Number(uiAmount || 0);
  }, [isMultipleWallets, transferInput, uiAmount]);

  const isAmountZero = totalUiAmount <= 0;

  /** -------------------------
   * Address validation
   * ------------------------ */

  // single recipient
  const isSingleAddressValid = useMemo(() => {
    if (!recipientAddress) return false;
    return isAddress(recipientAddress);
  }, [recipientAddress]);

  // multi recipient
  const isMultiRecipientsValid = useMemo(() => {
    if (!transferInput?.length) return false;

    return transferInput.every(
      (input) => isAddress(input.address) && Number(input.uiAmount) > 0
    );
  }, [transferInput]);

  /** -------------------------
   * Button disabled
   * ------------------------ */
  const isButtonDisabled = useMemo(() => {
    if (!selectedWalletAccount || !selectedToken) return true;
    if (hasInsufficientBalance) return true;

    if (transferType === "delayed") {
      return isAmountZero;
    }

    if (isMultipleWallets) {
      return !isMultiRecipientsValid;
    }

    return !isSingleAddressValid || isAmountZero;
  }, [
    selectedWalletAccount,
    selectedToken,
    hasInsufficientBalance,
    transferType,
    isMultipleWallets,
    isMultiRecipientsValid,
    isSingleAddressValid,
    isAmountZero,
  ]);

  /** -------------------------
   * Button text (UX feedback)
   * ------------------------ */
  const transferBtnText = useMemo(() => {
    if (isMultipleWallets && success && transferType === "direct") {
      return "Close";
    }

    if (error) return "Retry";

    if (success)
      return transferType === "delayed" ? "Deposit another" : "Send another";

    if (!selectedWalletAccount) return "Connect wallet";
    if (!selectedToken) return "Select a token";
    if (hasInsufficientBalance) return "Insufficient Balance";

    if (isMultipleWallets && !isMultiRecipientsValid) {
      return "Check recipients & amounts";
    }

    if (
      !isMultipleWallets &&
      !isSingleAddressValid &&
      transferType === "direct"
    ) {
      return "Enter recipient wallet address";
    }

    if (isAmountZero) return "Enter amount > 0";

    return transferType === "delayed" ? "Deposit" : "Send";
  }, [
    error,
    success,
    transferType,
    selectedWalletAccount,
    selectedToken,
    hasInsufficientBalance,
    isMultipleWallets,
    isMultiRecipientsValid,
    isSingleAddressValid,
    isAmountZero,
  ]);

  /** -------------------------
   * Confirmation popup text
   * ------------------------ */
  const confirmationPopUpText = useMemo(() => {
    if (transferType === "delayed") {
      return "You’re depositing privately:";
    }

    if (isMultipleWallets) {
      return "You're gonna send to multiple recipients privately:";
    }

    return "You’re gonna send privately:";
  }, [isMultipleWallets, transferType]);

  return {
    isButtonDisabled,
    transferBtnText,
    confirmationPopUpText,
    totalUiAmount,
  };
}
