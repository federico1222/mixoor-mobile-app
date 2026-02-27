import { useWalletSession } from "@/src/hooks/useWalletSession";
import { useUserDetails } from "@/src/hooks/userUser";
import { YStack } from "tamagui";
import MainHeading from "../common/MainHeading";
import SetUserNameModal from "../common/SetUserNameModal";
import AppLayout from "../layout/AppLayout";
import MixoorContent from "../layout/mixoor-content/MixoorContent";
import MixoorDepositTable from "../layout/mixoor-content/mixoor-deposit-table/MixoorDepositTable";
import MixoorTable from "../layout/mixoor-content/mixoor-table/MixoorTable";
import { useMobileWallet } from "@wallet-ui/react-native-kit";

export default function MainScreen() {
  const { account } = useMobileWallet();
  const { data: userDetails, isFetched } = useUserDetails();

  console.log("connected account", account); // ! DEBUG STATEMENT

  /*
   * Handle wallet session lifecycle (logout on account change, auto-auth)
   */
  useWalletSession();

  /**
   * Show username setup when:
   * - wallet connected
   * - user data fetched
   * - no user exists yet for this wallet
   */
  if (account && isFetched && !userDetails) {
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

        {/* Mixoor Deposits */}
        <MixoorDepositTable />

        {/* Mixoor Transaction History */}
        <MixoorTable />
      </YStack>
    </AppLayout>
  );
}
