import CustomDialog from "@/src/components/common/CustomDialog";
import { formatAddress } from "@/src/helpers";
import { calculateTransferFee } from "@/src/helpers/calculations";
import { useTransferButtonValidations } from "@/src/hooks/useTransferButtonValidations";
import { useTokenSelection, useTransferInput } from "@/src/provider";
import { PaperPlaneTiltIcon } from "phosphor-react-native";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";
import DialogTransferView from "./DialogTransferView";
import MultiRecipientCollapsible from "./MultiRecipientCollapsible";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useTransferWithToasts } from "@/src/hooks/useTransferWithToasts";
import { useAddressValidation } from "@/src/hooks/useAddressValidation";
import { useRiskCheck } from "@/src/hooks/useRiskCheck";
import { useTransferValidation } from "@/src/hooks/useTransferValidation";

export default function SendTxModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    uiAmount,
    totalAmount,
    transferType,
    transferInput,
    isMultipleWallets,
    address: recipientAddress,
  } = useTransferInput();
  const { account } = useMobileWallet();

  const { handleTransfer, error, success, isLoading } = useTransferWithToasts();
  const { validationState } = useAddressValidation(recipientAddress);
  const { checkAddressRisk, isChecking } = useRiskCheck();

  const { selectedToken } = useTokenSelection();
  const {
    confirmationPopUpText,
    totalUiAmount,
    transferBtnText,
    isButtonDisabled,
  } = useTransferButtonValidations();
  const {
    isBalanceExceeded,
    showBalanceErrorToast,
    isBelowMinimum,
    showMinimumDepositToast,
  } = useTransferValidation();

  useEffect(() => {
    if (success) setOpen(false);
  }, [success, setOpen]);

  const handleTransferPrivately = useCallback(async () => {
    if (!account || !selectedToken) return;

    if (isBalanceExceeded) {
      showBalanceErrorToast();
      return;
    }

    if (isBelowMinimum) {
      showMinimumDepositToast();
      return;
    }

    // ranger api risk check
    const isAllowed = await checkAddressRisk(account.address);
    if (!isAllowed) return;

    await handleTransfer({
      uiAmount,
      recipientAddress:
        validationState?.resolvedSNSdAddress || recipientAddress,
      selectedToken,
      userAddress: account.address,
      isMultipleWallets,
      transferInput,
      transferType,
    });
  }, [
    account,
    checkAddressRisk,
    handleTransfer,
    isBalanceExceeded,
    isBelowMinimum,
    isMultipleWallets,
    recipientAddress,
    selectedToken,
    showBalanceErrorToast,
    showMinimumDepositToast,
    transferInput,
    transferType,
    uiAmount,
    validationState?.resolvedSNSdAddress,
  ]);

  return (
    <CustomDialog id="tx-modal" open={open} setOpen={setOpen} trigger={null}>
      <DialogTransferView
        transferError={error}
        transferSuccess={success}
        confirmationPopUpText={confirmationPopUpText}
      />

      <YStack my={"$6"} rounded={0} p={0}>
        {/* Amount */}
        <XStack
          py="$4"
          items={"center"}
          borderBottomWidth={1}
          justify="space-between"
          borderBottomColor="#27272A"
        >
          <Text fontSize={"$4"} color={"#FAFAFA"}>
            Amount:
          </Text>

          <XStack gap={"$2"}>
            <Text fontSize={"$6"} fontWeight={700}>
              {Number(totalUiAmount).toFixed(3)}
            </Text>

            <Text fontSize={"$6"} color={"rgba(250, 250, 250, 0.50)"}>
              {selectedToken?.symbol}
            </Text>
          </XStack>
        </XStack>

        {/* Recipient */}
        {transferType === "direct" && !isMultipleWallets && (
          <XStack
            py="$4"
            items="center"
            borderBottomWidth={1}
            justify="space-between"
            borderBottomColor="#27272A"
          >
            <Text fontSize="$4" color="#FAFAFA">
              Recipient:
            </Text>

            <Text
              fontSize="$6"
              fontWeight={700}
              color={recipientAddress ? "#FAFAFA" : "rgba(250, 250, 250, 0.50)"}
            >
              {recipientAddress
                ? formatAddress(recipientAddress, 3, 0, 3)
                : "Not set"}
            </Text>
          </XStack>
        )}

        {isMultipleWallets && (
          <MultiRecipientCollapsible
            transferInput={transferInput}
            symbol={selectedToken?.symbol || "SOL"}
          />
        )}

        <XStack
          py="$4"
          items="center"
          borderBottomWidth={1}
          justify="space-between"
          borderBottomColor="#27272A"
        >
          <Text fontSize="$4" color="#FAFAFA">
            Fees:
          </Text>

          <Text
            fontSize="$6"
            fontWeight={700}
            color={recipientAddress ? "#FAFAFA" : "rgba(250, 250, 250, 0.50)"}
          >
            ~ {""}
            {calculateTransferFee(isMultipleWallets ? totalAmount : uiAmount) ||
              0}
          </Text>
        </XStack>

        {account?.address && (
          <Button
            onPress={handleTransferPrivately}
            disabled={isLoading || isChecking || isButtonDisabled}
            height={"$4"}
            bg={error ? "#321812" : "#5D44BE"}
            opacity={isLoading || isChecking ? 0.7 : 1}
          >
            {isLoading || isChecking ? (
              <ActivityIndicator size="small" color="#CCCFF9" />
            ) : (
              <>
                <Text color={error ? "#FFC1B2" : "$secondary"}>
                  {transferBtnText}
                </Text>
                <PaperPlaneTiltIcon size={16} color="#CCCFF9" />
              </>
            )}
          </Button>
        )}
      </YStack>
    </CustomDialog>
  );
}
