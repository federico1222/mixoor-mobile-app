import { useAddressValidation } from "@/src/hooks/useAddressValidation";
import { UserCircle, Warning } from "phosphor-react-native";
import { useEffect } from "react";
import { TextInput } from "react-native";
import { Spinner, Text, XStack, YStack } from "tamagui";

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
  const { validationState, showSpinner, showError, handleInputChange } =
    useAddressValidation(value);

  useEffect(() => {
    onResolvedAddress(validationState.resolvedSNSdAddress);
  }, [validationState.resolvedSNSdAddress]);

  const handleAddressChange = (newValue: string) => {
    onChange(newValue);
    handleInputChange(newValue);
  };

  const inputId = `recipient-wallet-${index || 0}`;

  return (
    <YStack>
      {/* Input con icono */}
      <XStack
        py="$2"
        px="$3"
        items="center"
        borderWidth={1}
        borderColor={showError ? "#E53E3E" : "#27272A"}
        rounded="$3"
        height={44}
      >
        {/* Icono o Spinner */}
        {showSpinner ? (
          <Spinner size="small" color="#5D44BE" />
        ) : (
          <UserCircle size={18} color="#CED0D1" weight="fill" />
        )}

        {/* Input */}
        <TextInput
          style={{
            flex: 1,
            marginLeft: 12,
            height: 100,
            backgroundColor: "transparent",
            fontSize: 13,
            color: "#FAFAFA",
            fontFamily: "Noto_400",
            outline: "none",
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(250, 250, 250, 0.50)"
          value={value}
          onChangeText={handleAddressChange}
        />
      </XStack>

      {/* Error message */}
      {showError && (
        <XStack
          mt={10}
          gap="$3"
          items="center"
          bg="#2B0010"
          p="$2.5"
          rounded="$2"
        >
          <Warning size={14} color="#EFB2CE" weight="fill" />
          <Text fontSize={12} color="#EFB2CE" flex={1}>
            {validationState.errorMessage}
          </Text>
        </XStack>
      )}
    </YStack>
  );
}
