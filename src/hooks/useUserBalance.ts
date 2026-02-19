import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { address, type Address } from "@solana/kit";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { RpcContext, useMobileWallet } from "../context";

/**
 * Fetches the connected user's native SOL balance (in lamports)
 * using the RPC client. Automatically refetches when the wallet
 * address changes and is cached by React Query.
 */
export const useUserSolBalance = () => {
  const { rpc } = useContext(RpcContext);
  const { address: walletAddress } = useMobileWallet();

  return useQuery({
    queryKey: ["userSolBalance", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return 0;

      try {
        return (await rpc.getBalance(address(walletAddress)).send()).value;
      } catch (error) {
        console.log("error fetching user balance ->", error);
        throw error;
      }
    },
    enabled: !!walletAddress,
    retry: 2,
  });
};

/**
 * Fetches the connected user's SPL token balance for a given mint.
 * It derives the Associated Token Account (ATA) for the wallet and mint,
 * then queries its token balance via RPC. Query execution can be conditionally enabled.
 */
export const useUserSPLTokenBalance = (
  mint: Address,
  tokenProgram: Address = TOKEN_PROGRAM_ADDRESS,
  options?: { enabled?: boolean }
) => {
  const { rpc } = useContext(RpcContext);
  const { address } = useMobileWallet();

  return useQuery({
    queryKey: ["userTokenBalance", mint, tokenProgram],
    queryFn: async () => {
      try {
        if (!address) return 0;

        const [associatedTokenAddress] = await findAssociatedTokenPda({
          owner: address,
          tokenProgram,
          mint,
        });

        return (await rpc.getTokenAccountBalance(associatedTokenAddress).send())
          .value.amount;
      } catch (error) {
        console.log("error fetching token balance ->", error);
        throw error;
      }
    },
    retry: 2,
    enabled:
      !!address && !!mint && !!tokenProgram && (options?.enabled ?? true),
  });
};
