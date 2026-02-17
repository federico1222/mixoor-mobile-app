import { YStack } from "tamagui";
import MainHeading from "../common/MainHeading";
import AppLayout from "../layout/AppLayout";
import MixoorContent from "../layout/mixoor-content/MixoorContent";

export default function MainScreen() {
  return (
    <AppLayout>
      <YStack px={"$4"} py={"$6"} gap={"$5"} flex={1}>
        {/* Heading */}
        <MainHeading
          gap={"$2"}
          mb={"$2"}
          badgeText="Send Privately"
          title="Solana Private Transfer"
          flexDirection={"column"}
          desc="Transfer Funds Privately. No link, no trace, no mapping between wallets."
        />

        {/* Mixoor Conren */}
        <MixoorContent />
      </YStack>
    </AppLayout>
  );
}
