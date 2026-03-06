import {
  findPoolAddress,
  findVaultAddress,
  getDepositInstructionAsync,
} from "@smithii_io/mixoor";
import { findAssociatedTokenPda } from "@solana-program/token";
import {
  address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createTransactionMessage,
  getBase58Codec,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  type Address,
  type Signature,
} from "@solana/kit";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { randomBytes } from "crypto";
import { useCallback, useState } from "react";
import { RELAYER_ADDRESS } from "../constants";
import {
  calculateTransactionFeeLamports,
  calculateTransferFee,
  scaleToTokenAmount,
} from "../helpers/calculations";
import {
  MerkleTreeLocal as MerkleTree,
  generateCommitmentLocal as generateCommitment,
} from "../helpers/merkle";
import {
  AssetType,
  determineAssetType,
  transferLamportsInstruction,
} from "../helpers/misc";
import { confirmTransactionStatusWithRetry } from "../helpers/rpc";
import { useTokenSelection, useTransferInput } from "../provider";
import { MultiRecipient } from "../types";
import { useTransactionSigner } from "./useTransactionSigner";

/** Single recipient deposit result */
type SingleDepositResult = {
  txSignature: Signature;
  scaledAmount: bigint;
  secret: string;
  nullifier: string;
  commitment: string;
};

/** Multi-recipient deposit result */
type MultiDepositResult = {
  txSignature: Signature;
  recipients: MultiRecipient[];
};

/** Combined deposit result - discriminated by isMultipleWallets */
export type DepositResult =
  | ({ isMultipleWallets: false } & SingleDepositResult)
  | ({ isMultipleWallets: true } & MultiDepositResult);

export const useDeposit = () => {
  const { client, signAndSendTransaction, account } =
    useMobileWallet();
  const { getSendingSigner } = useTransactionSigner();
  const { transferInput, isMultipleWallets, uiAmount } = useTransferInput();
  const { selectedToken } = useTokenSelection();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const constructDepositInstruction = useCallback(
    async (args: {
      scaledAmount: bigint;
      assetType: AssetType;
      mint: Address;
      pool: Address;
    }) => {
      const { scaledAmount, assetType, mint, pool } = args;

      if (!selectedToken?.mintAddress || !account) {
        throw new Error("invalid arguments");
      }

      // FIXME: determine whether to use og or token22
      const [depositorTokenAccount] = await findAssociatedTokenPda({
        owner: account.address,
        tokenProgram: address(selectedToken.tokenProgram),
        mint,
      });
      const [vault] = await findVaultAddress({ pool });
      const [vaultTokenAccount] = await findAssociatedTokenPda({
        owner: vault,
        tokenProgram: address(selectedToken.tokenProgram),
        mint,
      });

      const merkleTree = new MerkleTree(20);

      // generate commitment
      const secret = randomBytes(32);
      const nullifier = randomBytes(32);
      const commitment = generateCommitment(
        secret,
        nullifier,
        scaledAmount,
        pool,
      );

      // Insert new commitment and get new root
      merkleTree.insert(commitment);
      const newRoot = merkleTree.root();

      const sendingSigner = await getSendingSigner();

      const depositIx = await getDepositInstructionAsync({
        depositor: sendingSigner,
        pool,
        amount: scaledAmount,
        commitment,
        newRoot,
        mint,
        depositorTokenAccount:
          assetType === AssetType.Sol ? undefined : depositorTokenAccount,
        vaultTokenAccount,
      });

      return { depositIx, secret, nullifier, commitment };
    },
    [
      account,
      getSendingSigner,
      selectedToken?.mintAddress,
      selectedToken?.tokenProgram,
    ],
  );

  /**
   * Normalizes transfer input for multi-recipient transfers.
   * Filters out empty addresses/amounts and calculates fees.
   */
  const getMultiRecipientAmounts = useCallback(() => {
    if (!selectedToken) return [];

    return transferInput
      ?.filter((ti) => ti.address?.trim() && Number(ti.uiAmount) > 0)
      ?.map((ti) => {
        const fee = calculateTransferFee(ti.uiAmount);
        const transferAmt =
          determineAssetType(selectedToken.mintAddress) === AssetType.Sol
            ? ti.uiAmount
            : (Number(ti.uiAmount) - Number(fee ?? 0)).toString();

        return {
          destination: ti.resolvedAddress || ti.address,
          scaledAmount: scaleToTokenAmount(transferAmt, selectedToken.decimals),
        };
      });
  }, [selectedToken, transferInput]);

  const buildSignAndConfirm = useCallback(
    async (
      instructions: Parameters<typeof appendTransactionMessageInstructions>[0],
      sendingSigner: Awaited<ReturnType<typeof getSendingSigner>>,
    ): Promise<Signature> => {
      const {
        context: { slot: minContextSlot },
        value: latestBlockhash,
      } = await client.rpc.getLatestBlockhash().send();
      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
        (tx) => setTransactionMessageFeePayerSigner(sendingSigner, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      );
      const tx = compileTransaction(transactionMessage);
      const txSigBytes = await signAndSendTransaction(tx, minContextSlot);
      const txSignature = getBase58Codec().decode(txSigBytes) as Signature;

      const isConfirmedResp = await confirmTransactionStatusWithRetry(
        client,
        [txSignature],
      );
      const isConfirmed = isConfirmedResp.every(
        (s) => s !== null && s.err === null,
      );
      if (!isConfirmed) throw new Error("Transaction error or confirm fail");

      return txSignature;
    },
    [client, signAndSendTransaction],
  );

  const buildAndSendDeposit = useCallback(
    async (
      depositInstructions: Awaited<ReturnType<typeof getDepositInstructionAsync>>[],
      sendingSigner: Awaited<ReturnType<typeof getSendingSigner>>,
      txFee: bigint,
    ): Promise<Signature> => {
      const transferFeeIx = await transferLamportsInstruction({
        source: sendingSigner,
        destination: RELAYER_ADDRESS,
        amount: txFee,
      });
      return buildSignAndConfirm(
        [transferFeeIx, ...depositInstructions],
        sendingSigner,
      );
    },
    [buildSignAndConfirm],
  );

  const depositMultiRecipient = useCallback(
    async (args: {
      sendingSigner: Awaited<ReturnType<typeof getSendingSigner>>;
      mint: Address;
      assetType: AssetType;
      pool: Address;
      txFee: bigint;
    }): Promise<{ isMultipleWallets: true } & MultiDepositResult> => {
      const { sendingSigner, mint, assetType, pool, txFee } = args;
      const recipientAmounts = getMultiRecipientAmounts();
      const depositInstructions: Awaited<ReturnType<typeof getDepositInstructionAsync>>[] = [];
      const recipients: Omit<MultiRecipient, "txSignature">[] = [];

      for (const { destination, scaledAmount } of recipientAmounts) {
        const result = await constructDepositInstruction({ scaledAmount, assetType, mint, pool });
        depositInstructions.push(result.depositIx);
        recipients.push({
          destination,
          amount: scaledAmount.toString(),
          secret: Buffer.from(result.secret).toString("base64"),
          nullifier: Buffer.from(result.nullifier).toString("base64"),
          commitment: Buffer.from(result.commitment).toString("base64"),
        });
      }

      const txSignature = await buildAndSendDeposit(depositInstructions, sendingSigner, txFee);

      return {
        isMultipleWallets: true,
        txSignature,
        recipients: recipients.map((r) => ({ ...r, txSignature })),
      };
    },
    [constructDepositInstruction, getMultiRecipientAmounts, buildAndSendDeposit],
  );

  const depositSingleRecipient = useCallback(
    async (args: {
      sendingSigner: Awaited<ReturnType<typeof getSendingSigner>>;
      mint: Address;
      assetType: AssetType;
      pool: Address;
      txFee: bigint;
      decimals: number;
    }): Promise<{ isMultipleWallets: false } & SingleDepositResult> => {
      const { sendingSigner, mint, assetType, pool, txFee, decimals } = args;
      const scaledAmount = scaleToTokenAmount(uiAmount, decimals);

      const result = await constructDepositInstruction({ scaledAmount, assetType, mint, pool });

      const txSignature = await buildAndSendDeposit([result.depositIx], sendingSigner, txFee);

      return {
        isMultipleWallets: false,
        txSignature,
        scaledAmount,
        secret: Buffer.from(result.secret).toString("base64"),
        nullifier: Buffer.from(result.nullifier).toString("base64"),
        commitment: Buffer.from(result.commitment).toString("base64"),
      };
    },
    [constructDepositInstruction, buildAndSendDeposit, uiAmount],
  );

  const deposit = useCallback(async (): Promise<DepositResult> => {
    if (!account?.address) {
      const err = new Error("Please connect your wallet!!!");
      setError(err);
      throw err;
    }
    if (!selectedToken?.mintAddress || !selectedToken?.decimals) {
      throw new Error("Invalid mint address or decimals");
    }

    setIsLoading(true);
    setError(null);

    try {
      const sendingSigner = await getSendingSigner();
      const mint = address(selectedToken.mintAddress);
      const assetType = determineAssetType(mint);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [pool] = await findPoolAddress({ mint, assetType: assetType as any });
      const noOfRecipients = isMultipleWallets
        ? transferInput.filter((ti) => ti.address?.trim() && Number(ti.uiAmount) > 0).length
        : 1;
      const txFee = calculateTransactionFeeLamports(assetType, noOfRecipients);
      const commonArgs = { sendingSigner, mint, assetType, pool, txFee };

      const result = isMultipleWallets
        ? await depositMultiRecipient(commonArgs)
        : await depositSingleRecipient({ ...commonArgs, decimals: selectedToken.decimals });

      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, [
    account?.address,
    depositMultiRecipient,
    depositSingleRecipient,
    getSendingSigner,
    isMultipleWallets,
    transferInput,
    selectedToken,
  ]);

  return {
    deposit,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
