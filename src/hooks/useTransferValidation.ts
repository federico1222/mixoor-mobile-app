import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { WRAPPED_SOL_MINT_TOKEN_PROGRAM } from "../constants";
import { getMinAmount, getMintAddress } from "../helpers";
import { useUserSolBalance, useUserSPLTokenBalance } from "./useUserBalance";
import { scaleToUIAmount } from "../helpers/calculations";
import { useCallback, useMemo } from "react";
import { address } from "@solana/kit";
import { useTokenSelection, useTransferInput } from "../provider";
import { useToast } from "../provider/toast-provider";

export const useTransferValidation = () => {
  const { transferInput, uiAmount, isMultipleWallets } = useTransferInput();
  const { selectedToken } = useTokenSelection();
  const { toast } = useToast();

  /* ---------------------------------- */
  /* Token + balance setup              */
  /* ---------------------------------- */

  const isSol =
    selectedToken?.mintAddress === WRAPPED_SOL_MINT_TOKEN_PROGRAM.toString();

  const mintAddress = getMintAddress(selectedToken);

  const solBalanceQuery = useUserSolBalance();
  const splBalanceQuery = useUserSPLTokenBalance(
    mintAddress,
    address(selectedToken?.tokenProgram ?? TOKEN_PROGRAM_ADDRESS),
    { enabled: !!selectedToken && !isSol },
  );

  const { data: tokenBalance } = isSol ? solBalanceQuery : splBalanceQuery;

  const tokenBalanceUI = scaleToUIAmount(
    tokenBalance,
    selectedToken?.decimals ?? 0,
  );

  const userBalance = Number(tokenBalanceUI || 0);

  /* ---------------------------------- */
  /* Amount normalization               */
  /* ---------------------------------- */

  const singleAmountNum = Number(uiAmount);

  const multiAmounts = useMemo(
    () =>
      transferInput.map((i: any) => {
        const n = Number(i.uiAmount);
        return Number.isFinite(n) ? n : 0;
      }),
    [transferInput],
  );

  const totalAmountNum = isMultipleWallets
    ? multiAmounts.reduce((acc: any, v: any) => acc + v, 0)
    : Number.isFinite(singleAmountNum)
      ? singleAmountNum
      : 0;

  /* ---------------------------------- */
  /* Minimum validation                 */
  /* ---------------------------------- */

  const minAmount = getMinAmount(isSol, selectedToken?.symbol);

  const isBelowMinimum = isMultipleWallets
    ? multiAmounts.some((amount) => amount > 0 && amount < (minAmount ?? 0))
    : Number.isFinite(singleAmountNum) &&
      singleAmountNum > 0 &&
      singleAmountNum < (minAmount ?? 0);

  /* ---------------------------------- */
  /* Balance validation                 */
  /* ---------------------------------- */

  const isBalanceExceeded = totalAmountNum > userBalance;

  /* ---------------------------------- */
  /* Toasts                             */
  /* ---------------------------------- */

  const showMinimumDepositToast = useCallback(() => {
    if (!isBelowMinimum) return;

    toast({
      type: "error",
      title: "Minimum Deposit Not Met",
      description: `The minimum deposit for ${
        selectedToken?.symbol || "SOL"
      } is ${minAmount}`,
      duration: 10000,
    });
  }, [isBelowMinimum, minAmount, selectedToken?.symbol, toast]);

  const showBalanceErrorToast = useCallback(() => {
    if (!isBalanceExceeded) return;

    toast({
      type: "error",
      title: "Insufficient Balance",
      description: `Total amount (${totalAmountNum.toFixed(
        2,
      )}) exceeds your balance (${userBalance.toFixed(2)} ${
        selectedToken?.symbol || "SOL"
      })`,
      duration: 10000,
    });
  }, [isBalanceExceeded, totalAmountNum, userBalance, selectedToken?.symbol, toast]);

  return {
    userBalance,
    totalAmountNum,
    minAmount,
    isBelowMinimum,
    isBalanceExceeded,
    showMinimumDepositToast,
    showBalanceErrorToast,
  };
};
