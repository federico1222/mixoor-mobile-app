import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { address, type Address } from "@solana/kit";
import { useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";

/**
 * Fetches the connected user's native SOL balance (in lamports)
 * using the RPC client. Automatically refetches when the wallet
 * address changes and is cached by React Query.
 */
export const useUserSolBalance = () => {
  const { account, client } = useMobileWallet();

  return useQuery({
    queryKey: ["userSolBalance", account?.address],
    queryFn: async () => {
      if (!account?.address) return 0;

      try {
        return (await client.rpc.getBalance(address(account?.address)).send())
          .value;
      } catch (error) {
        console.log("error fetching user balance ->", error);
        throw error;
      }
    },
    enabled: !!account?.address,
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
  const { account, client } = useMobileWallet();

  return useQuery({
    queryKey: ["userTokenBalance", mint, tokenProgram],
    queryFn: async () => {
      try {
        if (!account?.address) return 0;

        const [associatedTokenAddress] = await findAssociatedTokenPda({
          owner: account?.address,
          tokenProgram,
          mint,
        });

        return (
          await client.rpc.getTokenAccountBalance(associatedTokenAddress).send()
        ).value.amount;
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
