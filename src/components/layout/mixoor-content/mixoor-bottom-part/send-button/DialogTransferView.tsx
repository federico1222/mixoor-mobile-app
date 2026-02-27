import { CheckCircle, WarningCircle } from "phosphor-react-native";
import { Dialog, Text, XStack, YStack } from "tamagui";

export default function DialogTransferView({
  transferError,
  transferSuccess,
  confirmationPopUpText,
}: {
  transferError: boolean;
  transferSuccess: boolean;
  confirmationPopUpText: string;
}) {
  return (
    <Dialog.Title>
      {!transferSuccess && !transferError && (
        <YStack gap="$4" mb="$6">
          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            Confirm Transaction
          </Text>

          <Text color="rgba(250, 250, 250, 0.50)" fontSize={16}>
            {confirmationPopUpText}
          </Text>
        </YStack>
      )}

      {transferSuccess && !transferError && (
        <YStack gap="$3" mb="$6" items="center">
          <XStack
            width={56}
            height={56}
            rounded="$2"
            borderWidth={1}
            borderColor="#27272A"
            bg="#0B1209"
            items="center"
            justify="center"
          >
            <CheckCircle size={32} color="#56A54A" weight="fill" />
          </XStack>

          <Text
            lineHeight={30}
            style={{ textAlign: "center" }}
            fontSize={24}
            fontWeight="700"
            color="#FAFAFA"
          >
            Your transaction was sent{"\n"}successfully
          </Text>
        </YStack>
      )}

      {!transferSuccess && transferError && (
        <YStack gap="$4" mb="$6">
          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            Confirm Transaction
          </Text>

          <YStack bg="#321812" p="$4" gap="$2" rounded="$2" width="100%">
            <XStack gap="$2" items="center">
              <WarningCircle size={16} color="#FFC1B2" weight="fill" />
              <Text
                textAlignVertical="center"
                fontSize={14}
                fontWeight="600"
                color="#FFC1B2"
              >
                Transaction Failed
              </Text>
            </XStack>

            <Text fontSize={13} color="#E3735B">
              Your transfer couldn&apos;t be completed. Don&apos;t worry, no
              funds were moved. Please try the request again.
            </Text>
          </YStack>

          <Text color="rgba(250, 250, 250, 0.50)" fontSize={16}>
            {confirmationPopUpText}
          </Text>
        </YStack>
      )}
    </Dialog.Title>
  );
}
