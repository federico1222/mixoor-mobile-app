import { YStack } from "tamagui";
import MainHeading from "../common/MainHeading";

export default function MainScreen() {
  return (
    <YStack px={"$6"} py={"$7"} gap={"$5"} flex={1}>
      {/* Heading */}
      <MainHeading
        gap={"$2"}
        mb={"$2"}
        badgeText="Send Privately"
        title="Solana Private Transfer"
        flexDirection={"column"}
        desc="Transfer Funds Privately. No link, no trace, no mapping between wallets."
      />
    </YStack>
  );
}
