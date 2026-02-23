import CustomDialog from "@/src/components/common/CustomDialog";
import { useMobileWallet } from "@/src/context";
import { formatAddress } from "@/src/helpers";
import { calculateTransferFee } from "@/src/helpers/calculations";
import { useTransferButtonValidations } from "@/src/hooks/useTransferButtonValidations";
import { useTokenSelection, useTransferInput } from "@/src/provider";
import { PaperPlaneTiltIcon } from "phosphor-react-native";
import { Dispatch, SetStateAction } from "react";
import { Button, Text, XStack, YStack } from "tamagui";
import DialogTransferView from "./DialogTransferView";
import MultiRecipientCollapsible from "./MultiRecipientCollapsible";

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

  const { selectedToken } = useTokenSelection();
  const { confirmationPopUpText, totalUiAmount } =
    useTransferButtonValidations();
  const { address: selectedWalletAccount } = useMobileWallet();

  const error = false;
  const success = false;

  // TODO: work here
  // TODO: work here

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

        {selectedWalletAccount && (
          <Button height={"$4"} bg={error ? "#321812" : "#5D44BE"}>
            <Text color={error ? "#FFC1B2" : "$secondary"}>Send</Text>

            <PaperPlaneTiltIcon size={16} color="#CCCFF9" />
          </Button>
        )}
      </YStack>
    </CustomDialog>
  );
}
