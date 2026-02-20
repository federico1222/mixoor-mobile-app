import CustomContainer from "@/src/components/common/CustomContainer";
import { Text, YStack } from "tamagui";
import TransactionsTable from "./TransactionsTable";

export default function MixoorTable() {
  return (
    <CustomContainer
      width={"100%"}
      p={"$5"}
      display={"flex"}
      flexDirection={"column"}
      self={"flex-start"}
      gap={"$7"}
    >
      <YStack gap={2}>
        <Text
          fontSize={"$4"}
          fontWeight={600}
          color={"#FAFAFA"}
          fontFamily={"$mono"}
        >
          Transaction History
        </Text>

        <Text
          fontWeight={400}
          color={"rgba(250, 250, 250, 0.50)"}
          fontSize={"$2"}
        >
          Track your recent SOL transactions. You&#39;re the only person who can
          see this logs
        </Text>
      </YStack>

      <TransactionsTable />
    </CustomContainer>
  );
}
