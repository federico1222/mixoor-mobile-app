import { useMobileWallet } from "@/src/context";
import { useUserDetails } from "@/src/hooks/userUser";
import { YStack } from "tamagui";
import MainHeading from "../common/MainHeading";
import SetUserNameModal from "../common/SetUserNameModal";
import AppLayout from "../layout/AppLayout";
import MixoorContent from "../layout/mixoor-content/MixoorContent";

export default function MainScreen() {
  const { address: walletAddress } = useMobileWallet();
  const { data: userDetails, isFetched } = useUserDetails();

  /**
   * Show username setup when:
   * - wallet connected
   * - user data fetched
   * - no user exists yet for this wallet
   */
  if (walletAddress && isFetched && !userDetails) {
    return <SetUserNameModal />;
  }

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
