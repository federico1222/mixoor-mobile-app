import { formatAddress } from "@/src/helpers";
import { useRetryFailedTransfer } from "@/src/hooks/useRetryFailedTransfer";
import { useUserPreviousTransfers } from "@/src/hooks/userUser";
import {
  ArrowClockwiseIcon,
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  CopyIcon,
  UsersIcon,
  WarningCircleIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import { Button, Sheet, Text, XStack, YStack } from "tamagui";

const COL_DATE = 110;
const COL_RECIPIENT = 180;
const COL_AMOUNT = 110;
const TABLE_WIDTH = COL_DATE + COL_RECIPIENT + COL_AMOUNT;

export default function TransactionSidebar({
  copiedId,
  handleCopy,
}: {
  copiedId: string | null;
  handleCopy: (wallet: string, id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data: transfersResponse, refetch } = useUserPreviousTransfers(
    limit,
    offset
  );
  const previousTransfers = transfersResponse?.data || [];
  const pagination = transfersResponse?.pagination;

  const { retryingId, handleRetry, isFailedTransfer } =
    useRetryFailedTransfer(refetch);

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          borderWidth: 1,
          borderColor: "#5D44BE",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
        })}
      >
        <Text color="#CACCFC" fontSize={12}>
          View full history
        </Text>
        <ArrowUpRightIcon size={14} color="#CACCFC" />
      </Pressable>

      {/* Sheet fullscreen */}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[100]}
        dismissOnSnapToBottom={false}
        modal
        disableDrag={true}
      >
        <Sheet.Overlay
          backgroundColor="rgba(0, 0, 0, 0.76)"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backdropFilter="blur(10px)"
        />
        <Sheet.Frame bg={"$background"} pt={80} pb={30} px={20}>
          <YStack gap="$3" pb={30}>
            <Text fontSize={24} fontWeight="700" color="#FAFAFA">
              Transaction History
            </Text>
            <Text color="rgba(250, 250, 250, 0.50)" fontSize={14}>
              Track your recent SOL transactions. You&#39;re the only person who
              can see this logs
            </Text>
          </YStack>

          {/* Table */}
          <ScrollView style={{ flex: 1 }}>
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
                            style={{ position: "absolute", left: 6, top: 3 }}
                          />
                        )}
                        <Text fontSize={14} color={textColor} fontWeight="400">
                          {new Date(item.createdAt).toLocaleDateString(
                            "es-AR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
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
                        ) : item.multiRecipients &&
                          item.multiRecipients.length > 0 ? (
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
              </YStack>
            </ScrollView>

            {/* Pagination */}
            {pagination && pagination.total > 10 && (
              <XStack justify="center" items="center" mt="$4" gap="$4">
                <Pressable
                  onPress={() => setOffset((prev) => Math.max(0, prev - limit))}
                  disabled={offset === 0}
                  style={({ pressed }) => ({
                    opacity: offset === 0 ? 0.4 : pressed ? 0.7 : 1,
                    borderWidth: 1,
                    borderColor: "#5D44BE",
                    borderRadius: 6,
                    padding: 8,
                  })}
                >
                  <CaretLeftIcon size={14} color="#CACCFC" />
                </Pressable>

                <Text fontSize={14} color="rgba(250, 250, 250, 0.70)">
                  Page {Math.floor(offset / limit) + 1} of{" "}
                  {Math.ceil(pagination.total / limit)}
                </Text>

                <Pressable
                  onPress={() => setOffset((prev) => prev + limit)}
                  disabled={!pagination.hasMore}
                  style={({ pressed }) => ({
                    opacity: !pagination.hasMore ? 0.4 : pressed ? 0.7 : 1,
                    borderWidth: 1,
                    borderColor: "#5D44BE",
                    borderRadius: 6,
                    padding: 8,
                  })}
                >
                  <CaretRightIcon size={14} color="#CACCFC" />
                </Pressable>
              </XStack>
            )}
          </ScrollView>

          <Button
            mt={40}
            height={44}
            width={"100%"}
            outline={"none"}
            onPress={() => setOpen(false)}
            bg={"rgba(93, 68, 190, 1)"}
          >
            <Text fontWeight={500}>Close</Text>
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
