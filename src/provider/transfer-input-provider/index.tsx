import { DEFAULT_INPUT } from "@/src/data";
import { TransferInput, TransferType } from "@/src/types";
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
}

const TransferInputContext = createContext<
  TransferInputContextType | undefined
>(undefined);

export const TransferInputProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transferType, setTransferType] = useState<TransferType>("direct");
  const [isMultipleWallets, setIsMultipleWallets] = useState<boolean>(false);

  const [address, setAddress] = useState<string>("");
  const [uiAmount, setUiAmount] = useState<string>("");
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [transferInput, setTransferInput] =
    useState<TransferInput[]>(DEFAULT_INPUT);

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

  const contextValue = useMemo(
    () => ({
      transferType,
      setTransferType,
      isMultipleWallets,
      setIsMultipleWallets,
      totalAmount,
      address,
      setAddress,
      uiAmount,
      setUiAmount,
      displayAmount,
      setDisplayAmount,
      setTransferInput,
      transferInput,
    }),
    [
      transferType,
      setTransferType,
      isMultipleWallets,
      setIsMultipleWallets,
      totalAmount,
      address,
      setAddress,
      uiAmount,
      setUiAmount,
      displayAmount,
      setDisplayAmount,
      setTransferInput,
      transferInput,
    ],
  );

  return (
    <TransferInputContext.Provider value={contextValue}>
      {children}
    </TransferInputContext.Provider>
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
