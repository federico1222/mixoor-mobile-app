import { CheckCircle, WarningCircle } from "phosphor-react-native";
import { Text, XStack, YStack } from "tamagui";

export default function DialogWithdrawView({
  withdrawError,
  withdrawSuccess,
}: {
  withdrawError: boolean;
  withdrawSuccess: boolean;
}) {
  return (
    <>
      {/* Estado normal - Confirmar retiro */}
      {!withdrawSuccess && !withdrawError && (
        <YStack gap="$10" mt="$6">
          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            Confirm Withdrawal
          </Text>

          <Text color="rgba(250, 250, 250, 0.50)" fontSize={16}>
            Review the withdrawal details below. Your funds will be sent
            privately to the specified address.
          </Text>
        </YStack>
      )}

      {/* Estado de éxito */}
      {withdrawSuccess && !withdrawError && (
        <YStack gap="$3" mt="$6" items="center">
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
            fontSize={24}
            fontWeight="700"
            color="#FAFAFA"
            style={{ textAlign: "center" }}
          >
            Your withdrawal was sent{"\n"}successfully
          </Text>
        </YStack>
      )}

      {/* Estado de error */}
      {!withdrawSuccess && withdrawError && (
        <YStack gap="$10" mt="$6">
          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            Confirm Withdrawal
          </Text>

          {/* Alert de error */}
          <XStack bg="#321812" p="$4" gap="$3" rounded="$2" items="flex-start">
            <WarningCircle size={16} color="#FFC1B2" weight="fill" />

            <YStack flex={1} gap="$2">
              <Text fontSize={14} fontWeight="600" color="#FFC1B2">
                Withdrawal Failed
              </Text>

              <Text fontSize={14} color="#E3735B">
                Your withdrawal couldn&#39;t be completed. Don&#39;t worry, no
                funds were moved. Please try the request again.
              </Text>
            </YStack>
          </XStack>

          <Text color="rgba(250, 250, 250, 0.50)" fontSize={16}>
            Review the withdrawal details below and try again.
          </Text>
        </YStack>
      )}
    </>
  );
}
