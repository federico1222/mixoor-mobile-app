import CustomTooltip from "@/src/components/common/CustomTooltip";
import InstallWalletModal from "@/src/components/layout/wallet/InstallWalletModal";
import WalletSelectorModal from "@/src/components/layout/wallet/WalletSelectorModal";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useWalletConnect } from "@/src/hooks/useWalletConnect";
import { calculateTransferFee } from "@/src/helpers/calculations";
import { useTokenSelection, useTransferInput } from "@/src/provider";
import { InfoIcon, PaperPlaneTiltIcon } from "phosphor-react-native";
import { useState } from "react";
import { Button, Spinner, Text, XStack, YStack } from "tamagui";
import SendTxModal from "./SendTxModal";

export default function SendButton() {
  const [openTxModal, setOpenTxModal] = useState(false);

  const { account } = useMobileWallet();
  const {
    isConnecting,
    signingState,
    showInstallModal,
    setShowInstallModal,
    showSelectorModal,
    setShowSelectorModal,
    detectedWallets,
    handleConnect,
    handleSelectWallet,
  } = useWalletConnect();

  const { selectedToken } = useTokenSelection();
  const { uiAmount, transferType, isMultipleWallets, totalAmount } =
    useTransferInput();

  const buttonLabel = !account?.address
    ? signingState === "awaiting_wallet"
      ? "Check your wallet..."
      : isConnecting
      ? "Connecting..."
      : "Connect Wallet"
    : transferType === "direct"
      ? "Send Privately"
      : "Deposit";

  return (
    <>
      <YStack width={"100%"} gap={"$3"}>
        <XStack width={"100%"} justify={"center"} gap={"$2"}>
          <Text ml={1} fontWeight={400} color={"#CED0D1"}>
            Fees: ~
            {calculateTransferFee(isMultipleWallets ? totalAmount : uiAmount) ||
              0}{" "}
            {selectedToken?.symbol}
          </Text>

          <CustomTooltip
            content={
              <YStack gap="$1">
                <Text fontSize={12} color={"$background"} fontWeight={500}>
                  • 0.15% of sending amount
                </Text>
                <Text fontSize={12} color={"$background"} fontWeight={500}>
                  • 0.006 {selectedToken?.symbol} network and rent fee
                </Text>
                <Text fontSize={12} color={"$background"} fontWeight={500}>
                  for each recipient wallet
                </Text>
              </YStack>
            }
          >
            <InfoIcon
              size={16}
              color="#BBBBBB"
              weight="fill"
              style={{ position: "relative", top: 2 }}
            />
          </CustomTooltip>
        </XStack>

        <Button
          width={"100%"}
          height={"$4"}
          bg={"#5D44BE"}
          onPress={() => (account?.address ? setOpenTxModal(true) : handleConnect())}
          disabled={isConnecting}
          opacity={isConnecting ? 0.7 : 1}
        >
          {isConnecting && <Spinner size="small" color="#CCCFF9" />}
          <Text color={"$secondary"}>{buttonLabel}</Text>
          {!isConnecting && <PaperPlaneTiltIcon size={16} color="#CCCFF9" />}
        </Button>
      </YStack>

      {/* Send Transaction Modal */}
      {account?.address && (
        <SendTxModal open={openTxModal} setOpen={setOpenTxModal} />
      )}

      <InstallWalletModal
        open={showInstallModal}
        onOpenChange={setShowInstallModal}
      />

      <WalletSelectorModal
        open={showSelectorModal}
        onOpenChange={setShowSelectorModal}
        wallets={detectedWallets}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
}
