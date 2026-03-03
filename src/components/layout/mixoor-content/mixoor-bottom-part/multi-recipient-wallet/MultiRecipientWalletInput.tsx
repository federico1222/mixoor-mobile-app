import WalletAddressInput from "@/src/components/common/WalletAddressInput";

interface MultiRecipientWalletInputProps {
  value: string;
  onChange: (value: string) => void;
  onResolvedAddress: (resolved: string | undefined) => void;
  placeholder?: string;
  index?: number;
}

export default function MultiRecipientWalletInput({
  value,
  onChange,
  onResolvedAddress,
  placeholder = "Enter Wallet Address",
  index,
}: MultiRecipientWalletInputProps) {
  return (
    <WalletAddressInput
      value={value}
      onChange={onChange}
      onResolvedAddress={onResolvedAddress}
      placeholder={placeholder}
      index={index}
    />
  );
}
