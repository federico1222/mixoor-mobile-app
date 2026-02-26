import CustomDialog from "@/src/components/common/CustomDialog";
import { useAddressValidation } from "@/src/hooks/useAddressValidation";
import { useUserDeposits } from "@/src/hooks/userUser";
import { sparsedTransferFromBE } from "@/src/services/transfer.service";
import { UserDeposits } from "@/src/types/user";
import { PaperPlaneTiltIcon } from "phosphor-react-native";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Button, Text, YStack } from "tamagui";
import DialogWithdrawView from "./DialogWithdrawView";
import WithdrawModalBody from "./WithdrawModalBody";
import { useMobileWallet } from "@wallet-ui/react-native-kit";

interface WithdrawModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  depositDetails: UserDeposits;
}

export default function WithdrawModal({
  open,
  setOpen,
  depositDetails,
}: WithdrawModalProps) {
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<boolean>(false);

  const { account } = useMobileWallet();

  const { validationState } = useAddressValidation(recipientAddress);
  const { refetch } = useUserDeposits();

  const resetWithdrawState = useCallback(() => {
    setRecipientAddress("");
    setWithdrawSuccess(false);
    setWithdrawError(false);
    refetch();
  }, [setRecipientAddress, setWithdrawSuccess, setWithdrawError, refetch]);

  const handleWithdraw = async () => {
    if (!recipientAddress || !account?.address) return;

    try {
      setIsLoading(true);

      await sparsedTransferFromBE({
        userAddress: account?.address,
        depositId: depositDetails.id,
        recipientAddress:
          validationState?.resolvedSNSdAddress || recipientAddress,
      });

      setWithdrawSuccess(true);
      setWithdrawError(false);
    } catch (error) {
      console.error("Withdraw error:", error);
      setWithdrawError(true);
      setWithdrawSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (withdrawSuccess) {
      resetWithdrawState();
    } else {
      handleWithdraw();
    }
  };

  const isButtonDisabled = !recipientAddress || isLoading || withdrawError;

  return (
    <CustomDialog
      id="withdraw"
      open={open}
      setOpen={(value) => {
        if (!value && withdrawSuccess) {
          resetWithdrawState();
        }

        setOpen(value);
      }}
      trigger={null}
    >
      <DialogWithdrawView
        withdrawError={withdrawError}
        withdrawSuccess={withdrawSuccess}
      />

      <YStack mb={"$8"} flexDirection={"column"}>
        <WithdrawModalBody
          amount={depositDetails.uiAmount}
          tokenSymbol={depositDetails?.tokenMetadata?.symbol ?? "unknown"}
          recipientAddress={recipientAddress}
          setRecipientAddress={setRecipientAddress}
          withdrawError={withdrawError}
          withdrawSuccess={withdrawSuccess}
        />
      </YStack>

      <YStack>
        <Button
          height={44}
          bg={withdrawError ? "#321812" : "#5D44BE"}
          disabled={isButtonDisabled}
          onClick={handleButtonClick}
        >
          <Text color={withdrawError ? "#FFC1B2" : "#CCCFF9"}>
            {withdrawSuccess
              ? "Close"
              : withdrawError
                ? "Retry"
                : "Transfer Privately"}
          </Text>
          {!withdrawSuccess && <PaperPlaneTiltIcon size={16} color="#CCCFF9" />}
        </Button>
      </YStack>
    </CustomDialog>
  );
}
