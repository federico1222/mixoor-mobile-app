import CustomContainer from "@/src/components/common/CustomContainer";
import { useTransferInput } from "@/src/provider";
import { Text, YStack } from "tamagui";
import DepositTable from "./DepositTable";

export default function MixoorDepositTable() {
  const { transferType } = useTransferInput();

  if (transferType !== "delayed") {
    return null;
  }
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
          Deposited Funds
        </Text>

        <Text
          fontWeight={400}
          color={"rgba(250, 250, 250, 0.50)"}
          fontSize={"$2"}
        >
          Track the deposited funds through delayed transfers function. Withdraw
          them privately anytime. You’re the only person who can see these
          transactions.
        </Text>
      </YStack>

      <DepositTable />
    </CustomContainer>
  );
}
