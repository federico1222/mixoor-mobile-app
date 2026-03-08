import { ToastOverlay } from "@/src/provider/toast-provider";
import { useUserDeposits } from "@/src/hooks/userUser";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { ArrowUpRightIcon } from "phosphor-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack } from "tamagui";
import TokenIcon from "../../../common/TokenIcon";
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
  const { account } = useMobileWallet();
  const insets = useSafeAreaInsets();

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

      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <ToastOverlay />
        <View
          style={[
            styles.frame,
            {
              paddingTop: insets.top + 20,
              paddingBottom: Math.max(insets.bottom + 16, 30),
            },
          ]}
        >
          {/* Header */}
          <YStack gap="$3" pb={24}>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
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
                        <TokenIcon
                          symbol={item?.tokenMetadata?.symbol}
                          remoteUri={item?.tokenMetadata?.image}
                          mintAddress={item?.mintAddress}
                        />
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
                        <ActionCell item={item} userAddress={account?.address ?? ""} />
                      </XStack>
                    </XStack>
                  );
                })}
              </YStack>
            </ScrollView>
          </ScrollView>

          {/* Close Button */}
          <Button
            mt={16}
            height={44}
            width="100%"
            outline="none"
            onPress={() => setOpen(false)}
            bg="rgba(93, 68, 190, 1)"
          >
            <Text fontWeight={500}>Close</Text>
          </Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: "#09090B",
    paddingHorizontal: 20,
  },
});
