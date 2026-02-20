import { useMobileWallet } from "@/src/context";
import { formatAddress } from "@/src/helpers";
import { useRetryFailedTransfer } from "@/src/hooks/useRetryFailedTransfer";
import { useUserPreviousTransfers } from "@/src/hooks/userUser";
import {
  ArrowClockwiseIcon,
  CheckIcon,
  CopyIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  WarningCircleIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import { Text, XStack, YStack } from "tamagui";

const COL_DATE = 110;
const COL_RECIPIENT = 180;
const COL_AMOUNT = 110;
const TABLE_WIDTH = COL_DATE + COL_RECIPIENT + COL_AMOUNT;

export default function TransactionsTable() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data: transfersResponse, refetch } = useUserPreviousTransfers(5, 0);
  const previousTransfers = transfersResponse?.data;

  const { address: selectedWalletAccount } = useMobileWallet();
  const { retryingId, handleRetry, isFailedTransfer } =
    useRetryFailedTransfer(refetch);

  const handleCopy = async (wallet: string, txSignature: string) => {
    await navigator.clipboard.writeText(wallet);
    setCopiedId(txSignature);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!previousTransfers || previousTransfers.length === 0) {
    return (
      <YStack gap="$2" width="100%" items="center" justify="center">
        <MagnifyingGlassIcon color="rgba(250, 250, 250, 0.50)" />
        <Text color="rgba(250, 250, 250, 0.50)" fontSize="$1">
          {selectedWalletAccount
            ? "There are no transactions yet"
            : "Connect your wallet to see the transaction history"}
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <YStack width={TABLE_WIDTH}>
        {/* Header */}
        <XStack
          bg="rgba(64, 53, 122, 0.15)"
          borderTopLeftRadius={12}
          borderTopRightRadius={12}
          py="$3"
          borderBottomWidth={1}
          borderBottomColor="rgba(250, 250, 250, 0.1)"
        >
          <XStack width={COL_DATE} justify="center" items="center">
            <Text color="#CCCFF9" fontSize={14} fontWeight="400">
              Date
            </Text>
          </XStack>
          <XStack width={COL_RECIPIENT} justify="center" items="center">
            <Text color="#CCCFF9" fontSize={14} fontWeight="400">
              Recipient wallet
            </Text>
          </XStack>
          <XStack width={COL_AMOUNT} justify="center" items="center">
            <Text color="#CCCFF9" fontSize={14} fontWeight="400">
              Amount
            </Text>
          </XStack>
        </XStack>

        {/* Rows */}
        {previousTransfers.map((item, index, array) => {
          const isFailed = isFailedTransfer(item);
          const rowBg = isFailed
            ? "rgba(220, 38, 38, 0.15)"
            : "rgba(64, 53, 122, 0.15)";
          const textColor = isFailed ? "#FCA5A5" : "#FAFAFA";
          const isLast = index === array.length - 1;

          return (
            <XStack
              key={item.txSignature}
              bg={rowBg}
              py="$3"
              items="center"
              borderBottomWidth={isLast ? 0 : 1}
              borderBottomColor="rgba(250, 250, 250, 0.1)"
            >
              {/* Date cell */}
              <XStack
                width={COL_DATE}
                items="center"
                justify="center"
                gap="$2"
                position="relative"
              >
                {isFailed && (
                  <WarningCircleIcon
                    size={14}
                    color="#EF4444"
                    style={{ position: "absolute", left: 0, top: 3 }}
                  />
                )}
                <Text fontSize={14} color={textColor} fontWeight="400">
                  {new Date(item.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </Text>
              </XStack>

              {/* Recipient cell */}
              <XStack
                width={COL_RECIPIENT}
                items="center"
                justify="center"
                gap="$2"
              >
                {isFailed ? (
                  <>
                    <Text color="#FCA5A5" fontSize={12}>
                      Failed
                    </Text>
                    <Pressable
                      onPress={() => handleRetry(item)}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        borderWidth: 1,
                        borderColor: "#EF4444",
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor:
                          retryingId === item.depositId
                            ? "rgba(239, 68, 68, 0.2)"
                            : "transparent",
                      })}
                    >
                      <ArrowClockwiseIcon size={12} color="#FCA5A5" />
                      <Text color="#FCA5A5" fontSize={12}>
                        Retry
                      </Text>
                    </Pressable>
                  </>
                ) : item.multiRecipients && item.multiRecipients.length > 0 ? (
                  <XStack items="center" gap="$2">
                    <Text color="#CCCFF9" fontSize={14}>
                      {item.multiRecipients.length} recipients
                    </Text>
                    <UsersIcon size={16} color="#CCCFF9" />
                  </XStack>
                ) : (
                  <XStack items="center" gap="$2">
                    <Text color={textColor} fontSize={14}>
                      {formatAddress(
                        item?.recipientAddress || "",
                        3,
                        0,
                        3
                      )?.toUpperCase()}
                    </Text>
                    <Pressable
                      onPress={() =>
                        handleCopy(
                          item?.recipientAddress ?? "",
                          item.txSignature
                        )
                      }
                      hitSlop={8}
                    >
                      {copiedId === item.txSignature ? (
                        <CheckIcon size={14} color={textColor} />
                      ) : (
                        <CopyIcon size={14} color={textColor} />
                      )}
                    </Pressable>
                  </XStack>
                )}
              </XStack>

              {/* Amount cell */}
              <XStack
                width={COL_AMOUNT}
                items="center"
                justify="center"
                gap="$2"
              >
                <Text color={textColor} fontSize={14}>
                  {item.uiAmount}
                </Text>
                {item?.tokenMetadata?.image && (
                  <Image
                    source={{ uri: item.tokenMetadata.image }}
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  />
                )}
              </XStack>
            </XStack>
          );
        })}

        {/* Footer */}
        <YStack
          width="100%"
          p="$3"
          items="flex-end"
          borderBottomLeftRadius={12}
          borderBottomRightRadius={12}
          bg="rgba(64, 53, 122, 0.15)"
        />
      </YStack>
    </ScrollView>
  );
}
