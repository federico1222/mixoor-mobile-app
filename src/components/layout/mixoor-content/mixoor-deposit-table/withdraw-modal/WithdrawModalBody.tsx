import { formatAddress } from "@/src/helpers";
import { calculateTransferFee } from "@/src/helpers/calculations";
import { useAddressValidation } from "@/src/hooks/useAddressValidation";
import { Warning } from "phosphor-react-native";
import { TextInput } from "react-native";
import { Text, XStack, YStack } from "tamagui";

type WithdrawModalBodyProps = {
  amount: string | number;
  tokenSymbol: string;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  withdrawError: boolean;
  withdrawSuccess: boolean;
};

export default function WithdrawModalBody({
  amount,
  tokenSymbol,
  recipientAddress,
  setRecipientAddress,
  withdrawSuccess,
}: WithdrawModalBodyProps) {
  const { validationState, showError, handleInputChange } =
    useAddressValidation(recipientAddress);

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
    handleInputChange(value);
  };

  return (
    <>
      <XStack
        justify="space-between"
        py="$4"
        borderBottomWidth={1}
        borderBottomColor="#27272A"
      >
        <Text fontSize={18} color="#FAFAFA">
          Amount:
        </Text>

        <XStack gap="$2" items="baseline">
          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            {Number(amount).toFixed(3)}
          </Text>

          <Text fontSize={14} color="rgba(250, 250, 250, 0.50)">
            {tokenSymbol}
          </Text>
        </XStack>
      </XStack>

      {!withdrawSuccess && (
        <YStack
          py="$4"
          borderBottomWidth={1}
          borderBottomColor="#27272A"
          position="relative"
        >
          <Text fontSize={18} color="#FAFAFA" mt="$3">
            Recipient Address:
          </Text>

          <TextInput
            style={{
              height: 48,
              borderBottomWidth: 2,
              borderBottomColor: showError ? "#E53E3E" : "#5D44BE",
              backgroundColor: "transparent",
              color: "#FAFAFA",
              fontSize: 16,
              fontFamily: "Noto_400",
              outline: "none",
              paddingVertical: 8,
            }}
            placeholder="Enter wallet address"
            placeholderTextColor="rgba(250, 250, 250, 0.30)"
            value={recipientAddress}
            onChangeText={handleRecipientAddressChange}
          />

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
      )}

      {!withdrawSuccess && (
        <XStack
          justify="space-between"
          py="$4"
          borderBottomWidth={1}
          borderBottomColor="#27272A"
        >
          <Text fontSize={18} color="#FAFAFA">
            Fees:
          </Text>

          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            ~{calculateTransferFee(amount)}
          </Text>
        </XStack>
      )}

      {withdrawSuccess && (
        <XStack
          justify="space-between"
          py="$4"
          borderBottomWidth={1}
          borderBottomColor="#27272A"
        >
          <Text fontSize={18} color="#FAFAFA">
            Recipient:
          </Text>

          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            {formatAddress(recipientAddress, 3, 0, 3)}
          </Text>
        </XStack>
      )}
    </>
  );
}
