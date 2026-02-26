import { DEFAULT_INPUT } from "@/src/data";
import {
  useUserSolBalance,
  useUserSPLTokenBalance,
} from "@/src/hooks/useUserBalance";
import { TransferInput, TransferType, UserToken } from "@/src/types";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface TransferInputContextType {
  transferType: TransferType;
  setTransferType: Dispatch<SetStateAction<TransferType>>;

  isMultipleWallets: boolean;
  setIsMultipleWallets: Dispatch<SetStateAction<boolean>>;

  address: string;
  setAddress: Dispatch<SetStateAction<string>>;

  uiAmount: string;
  setUiAmount: Dispatch<SetStateAction<string>>;

  displayAmount: string;
  setDisplayAmount: Dispatch<SetStateAction<string>>;

  transferInput: TransferInput[];
  setTransferInput: Dispatch<SetStateAction<TransferInput[]>>;

  totalAmount: number;

  selectedToken: UserToken | undefined;
  setSelectedToken: Dispatch<SetStateAction<UserToken | undefined>>;
}

// Separate context for token selection to avoid re-renders
type TokenContextType = {
  selectedToken: UserToken | undefined;
  setSelectedToken: Dispatch<SetStateAction<UserToken | undefined>>;
  externalToken: UserToken | undefined;
  setExternalToken: Dispatch<SetStateAction<UserToken | undefined>>;
  isLoading: boolean;
};

const TransferInputContext = createContext<
  TransferInputContextType | undefined
>(undefined);

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TransferInputProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: solBalance, isLoading: isLoadingSol } = useUserSolBalance();
  const { data: usdcBalance, isLoading: isLoadingUsdc } =
    useUserSPLTokenBalance(USDC_MINT);

  const [transferType, setTransferType] = useState<TransferType>("direct");
  const [isMultipleWallets, setIsMultipleWallets] = useState<boolean>(false);

  const [selectedToken, setSelectedToken] = useState<UserToken | undefined>();
  const [externalToken, setExternalToken] = useState<UserToken | undefined>();

  const [address, setAddress] = useState<string>("");
  const [uiAmount, setUiAmount] = useState<string>("");
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [transferInput, setTransferInput] =
    useState<TransferInput[]>(DEFAULT_INPUT);

  const isLoading = isLoadingSol || isLoadingUsdc;

  const totalAmount = useMemo(() => {
    return transferInput.reduce((total, input) => {
      const amount = Number(input.uiAmount) || 0;
      return total + amount;
    }, 0);
  }, [transferInput]);

  useEffect(() => {
    if (transferType === "delayed") {
      setIsMultipleWallets(false);
    }
  }, [setIsMultipleWallets, transferType]);

  // Set default SOL token when balance is available
  useEffect(() => {
    if (solBalance !== undefined && !selectedToken) {
      setSelectedToken({ ...SOL_TOKEN_CONSTANT, balance: solBalance });
    }
  }, [selectedToken, solBalance]);

  // Update balance when it changes for the currently selected token
  useEffect(() => {
    if (!selectedToken) return;

    if (
      selectedToken.symbol === "SOL" &&
      solBalance !== undefined &&
      selectedToken.balance !== solBalance
    ) {
      setSelectedToken((prev) =>
        prev?.symbol === "SOL"
          ? { ...SOL_TOKEN_CONSTANT, balance: solBalance }
          : prev,
      );
    } else if (
      selectedToken.symbol === "USDC" &&
      usdcBalance !== undefined &&
      selectedToken.balance !== usdcBalance
    ) {
      setSelectedToken((prev) =>
        prev?.symbol === "USDC"
          ? { ...USDC_TOKEN_CONSTANT, balance: usdcBalance }
          : prev,
      );
    }
  }, [solBalance, usdcBalance, selectedToken]);

  // Memoize token context separately to avoid re-renders when amount/address changes
  const tokenContextValue = useMemo(
    () => ({
      selectedToken,
      setSelectedToken,
      externalToken,
      setExternalToken,
      isLoading,
      transferType,
      setTransferType,
      transferInput,
      setTransferInput,
    }),
    [
      selectedToken,
      externalToken,
      isLoading,
      transferType,
      transferInput,
      setTransferInput,
    ],
  );

  // Memoize the full context value
  const contextValue = useMemo(
    () => ({
      address,
      setAddress,
      uiAmount,
      setUiAmount,
      displayAmount,
      setDisplayAmount,
      isMultipleWallets,
      setIsMultipleWallets,
      selectedToken,
      setSelectedToken,
      externalToken,
      setExternalToken,
      isLoading,
      transferType,
      setTransferType,
      transferInput,
      setTransferInput,
      totalAmount,
    }),
    [
      address,
      uiAmount,
      displayAmount,
      isMultipleWallets,
      selectedToken,
      externalToken,
      isLoading,
      transferType,
      transferInput,
      setTransferInput,
      totalAmount,
    ],
  );

  return (
    <TokenContext.Provider value={tokenContextValue}>
      <TransferInputContext.Provider value={contextValue}>
        {children}
      </TransferInputContext.Provider>
    </TokenContext.Provider>
  );
};

export const useTransferInput = () => {
  const context = useContext(TransferInputContext);
  if (!context) {
    throw new Error(
      "useTransferInput must be used within a TransferInputProvider",
    );
  }
  return context;
};

// Hook for components that only need token data (won't re-render on amount/address changes)
export const useTokenSelection = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error(
      "useTokenSelection must be used within a TransferInputProvider",
    );
  }
  return context;
};
