import {
  SOL_TOKEN_CONSTANT,
  USDC_MINT,
  USDC_TOKEN_CONSTANT,
} from "@/src/constants";
import {
  useUserSolBalance,
  useUserSPLTokenBalance,
} from "@/src/hooks/useUserBalance";
import type { Lamports } from "@solana/kit";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export type UserToken = {
  mintAddress: string;
  name: string;
  symbol: string;
  description: string;
  supply: number;
  decimals: number;
  uri: string;
  tokenProgram: string;
  image: string | null;
  imageUri: string;
  price?: number;
  balance: number | string | Lamports;
};

interface TokenContextType {
  selectedToken: UserToken | undefined;
  setSelectedToken: Dispatch<SetStateAction<UserToken | undefined>>;

  externalToken: UserToken | undefined;
  setExternalToken: Dispatch<SetStateAction<UserToken | undefined>>;

  isLoading: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: solBalance, isLoading: isLoadingSol } = useUserSolBalance();
  const { data: usdcBalance, isLoading: isLoadingUsdc } =
    useUserSPLTokenBalance(USDC_MINT);

  const [selectedToken, setSelectedToken] = useState<UserToken | undefined>();
  const [externalToken, setExternalToken] = useState<UserToken | undefined>();

  const isLoading = isLoadingSol || isLoadingUsdc;

  useEffect(() => {
    if (solBalance !== undefined && !selectedToken) {
      setSelectedToken({ ...SOL_TOKEN_CONSTANT, balance: solBalance });
    }
  }, [solBalance, selectedToken]);

  useEffect(() => {
    if (!selectedToken) return;

    if (
      selectedToken.symbol === "SOL" &&
      solBalance !== undefined &&
      selectedToken.balance !== solBalance
    ) {
      setSelectedToken({ ...SOL_TOKEN_CONSTANT, balance: solBalance });
    }

    if (
      selectedToken.symbol === "USDC" &&
      usdcBalance !== undefined &&
      selectedToken.balance !== usdcBalance
    ) {
      setSelectedToken({ ...USDC_TOKEN_CONSTANT, balance: usdcBalance });
    }
  }, [solBalance, usdcBalance, selectedToken]);

  const value = useMemo(
    () => ({
      selectedToken,
      setSelectedToken,
      externalToken,
      setExternalToken,
      isLoading,
    }),
    [selectedToken, externalToken, isLoading],
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

export const useTokenSelection = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenSelection must be used within TokenProvider");
  }
  return context;
};
