import { useUserDeposits } from "@/src/hooks/userUser";
import { ArrowUpRightIcon } from "phosphor-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import { Button, Sheet, Text, XStack, YStack } from "tamagui";
import ActionCell from "./ActionCell";
import StatusCell from "./StatusCell";

const COL_DATE = 120;
const COL_AMOUNT = 140;
const COL_STATUS = 120;
const COL_ACTION = 120;
const TABLE_WIDTH = COL_DATE + COL_AMOUNT + COL_STATUS + COL_ACTION;

export default function DepositFoundSidebar() {
  const [open, setOpen] = useState(false);
  const { data } = useUserDeposits();

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
        <Sheet.Frame bg="#09090B" pt={80} pb={30} px={20}>
          {/* Header */}
          <YStack gap="$3" pb={30}>
            <Text fontSize={24} fontWeight="700" color="#FAFAFA">
              Deposited Funds
            </Text>
            <Text color="rgba(250, 250, 250, 0.50)" fontSize={14}>
              Track the deposited funds through delayed transfers function.
              Withdraw them privately anytime. You&#39;re the only person who
              can see these transactions.
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
                  <XStack width={COL_AMOUNT} justify="center" items="center">
                    <Text color="#CCCFF9" fontSize={14} fontWeight="400">
                      Amount
                    </Text>
                  </XStack>
                  <XStack width={COL_STATUS} justify="center" items="center">
                    <Text color="#CCCFF9" fontSize={14} fontWeight="400">
                      Status
                    </Text>
                  </XStack>
                  <XStack width={COL_ACTION} justify="center" items="center">
                    <Text color="#CCCFF9" fontSize={14} fontWeight="400">
                      Action
                    </Text>
                  </XStack>
                </XStack>

                {/* Rows */}
                {data?.map((item, index, array) => {
                  const isLast = index === array.length - 1;

                  return (
                    <XStack
                      key={`${item.mintAddress}-${index}`}
                      bg="rgba(64, 53, 122, 0.15)"
                      py="$3"
                      items="center"
                      borderBottomWidth={isLast ? 0 : 1}
                      borderBottomColor="rgba(250, 250, 250, 0.1)"
                    >
                      {/* Date */}
                      <XStack width={COL_DATE} justify="center" items="center">
                        <Text fontSize={14} color="#FAFAFA" fontWeight="400">
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

                      {/* Amount */}
                      <XStack
                        width={COL_AMOUNT}
                        justify="center"
                        items="center"
                        gap="$2"
                      >
                        <Text fontSize={14} color="#FAFAFA" fontWeight="400">
                          {item.uiAmount}
                        </Text>
                        {item?.tokenMetadata?.image && (
                          <Image
                            source={{ uri: item.tokenMetadata.image }}
                            style={{ width: 20, height: 20, borderRadius: 4 }}
                          />
                        )}
                      </XStack>

                      {/* Status */}
                      <XStack
                        width={COL_STATUS}
                        justify="center"
                        items="center"
                      >
                        <StatusCell isSpent={true} />
                      </XStack>

                      {/* Action */}
                      <XStack
                        width={COL_ACTION}
                        justify="center"
                        items="center"
                      >
                        <ActionCell item={item} />
                      </XStack>
                    </XStack>
                  );
                })}
              </YStack>
            </ScrollView>
          </ScrollView>

          {/* Close Button */}
          <Button
            mt={40}
            height={44}
            width="100%"
            outline="none"
            onPress={() => setOpen(false)}
            bg="rgba(93, 68, 190, 1)"
          >
            <Text fontWeight={500}>Close</Text>
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
