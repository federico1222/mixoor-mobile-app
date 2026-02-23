import { useMobileWallet } from "@/src/context";
import { useUserDeposits } from "@/src/hooks/userUser";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import React from "react";
import { Image, ScrollView as RNScrollView } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import ActionCell from "./ActionCell";
import DepositSidebarTable from "./DepositSidebarTable";
import StatusCell from "./StatusCell";

const COL_DATE = 110;
const COL_AMOUNT = 130;
const COL_STATUS = 110;
const COL_ACTION = 110;
const TABLE_WIDTH = COL_DATE + COL_AMOUNT + COL_STATUS + COL_ACTION;

export default function DepositTable() {
  const { data } = useUserDeposits();
  const { address: selectedWalletAccount } = useMobileWallet();

  if (!data || data.length === 0) {
    return (
      <YStack gap="$2" width="100%" items="center" justify="center">
        <MagnifyingGlassIcon color="rgba(250, 250, 250, 0.50)" />
        <Text color="rgba(250, 250, 250, 0.50)" fontSize="$1">
          {selectedWalletAccount
            ? "There are no deposits yet"
            : "Connect your wallet to see the deposited funds"}
        </Text>
      </YStack>
    );
  }

  return (
    <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        {data?.slice(0, 3)?.map((item, ix) => (
          <XStack
            key={`${item?.mintAddress}-${ix}`}
            bg="rgba(64, 53, 122, 0.15)"
            py="$3"
            items="center"
            borderBottomWidth={ix === Math.min(data.length, 3) - 1 ? 0 : 1}
            borderBottomColor="rgba(250, 250, 250, 0.1)"
          >
            {/* Date */}
            <XStack width={COL_DATE} justify="center" items="center">
              <Text fontSize={14} color="#FAFAFA" fontWeight="400">
                {new Date(item?.createdAt).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </Text>
            </XStack>

            {/* Amount */}
            <XStack width={COL_AMOUNT} justify="center" items="center" gap="$2">
              <Text fontSize={14} color="#FAFAFA" fontWeight="400">
                {item?.uiAmount}
              </Text>
              {/* FIXME: USE UNKNOWN TOKEN IMAGE BELOW */}
              <Image
                source={{ uri: item.tokenMetadata?.image }}
                style={{ width: 24, height: 24, borderRadius: 8 }}
              />
            </XStack>

            {/* Status */}
            <XStack width={COL_STATUS} justify="center" items="center">
              <StatusCell isSpent={true} />
            </XStack>

            {/* Action */}
            <XStack width={COL_ACTION} justify="center" items="center">
              <ActionCell item={item} />
            </XStack>
          </XStack>
        ))}

        {/* Footer */}
        <YStack
          width="100%"
          p="$3"
          items="flex-end"
          borderBottomLeftRadius={12}
          borderBottomRightRadius={12}
          bg="rgba(64, 53, 122, 0.15)"
        >
          <DepositSidebarTable />
        </YStack>
      </YStack>
    </RNScrollView>
  );
}
