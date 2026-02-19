import { useAddressValidation } from "@/src/hooks/useAddressValidation";
import { useTransferInput } from "@/src/provider";
import { UserCircle, Warning } from "phosphor-react-native";
import { TextInput } from "react-native";
import { Spinner, Text, XStack, YStack } from "tamagui";

export default function SingleRecipientWallet() {
  const { address: recipientAddress, setAddress: setRecipientAddress } =
    useTransferInput();

  const { validationState, showSpinner, showError, handleInputChange } =
    useAddressValidation(recipientAddress);

  const handleAddressChange = (value: string) => {
    setRecipientAddress(value);
    handleInputChange(value);
  };

  return (
    <YStack flex={1}>
      {/* Label */}
      <Text fontSize={14} color="#FAFAFA" fontWeight="500">
        Recipient Wallet
      </Text>

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
            height: 100,
            marginLeft: 12,
            backgroundColor: "transparent",
            fontSize: 13,
            color: "#FAFAFA",
            fontFamily: "Noto_400",
            outline: "none",
          }}
          placeholder="Enter Your Wallet"
          placeholderTextColor="rgba(250, 250, 250, 0.50)"
          value={recipientAddress}
          onChangeText={handleAddressChange}
        />
      </XStack>

      {/* Error message */}
      {showError && (
        <XStack
          gap="$2"
          mt={10}
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
