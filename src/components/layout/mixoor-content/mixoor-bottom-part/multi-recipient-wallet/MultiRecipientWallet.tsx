import { useTransferInput } from "@/src/provider";
import { PlusIcon } from "phosphor-react-native";
import { Button, Text, YStack } from "tamagui";
import MultiRecipientWalletItem from "./MultiRecipientWalletItem";

export default function MultiRecipientWallet() {
  const { transferInput, setTransferInput } = useTransferInput();

  const handleAddressChange = (index: number, address: string) => {
    const updatedInputs = [...transferInput];
    updatedInputs[index] = {
      ...updatedInputs[index],
      address: address,
    };
    setTransferInput(updatedInputs);
  };

  const handleAmountChange = (index: number, uiAmount: string) => {
    const updatedInputs = [...transferInput];
    updatedInputs[index] = {
      ...updatedInputs[index],
      uiAmount: uiAmount,
    };
    setTransferInput(updatedInputs);
  };

  const handleResolvedAddressChange = (
    index: number,
    resolved: string | undefined
  ) => {
    const updatedInputs = [...transferInput];
    updatedInputs[index] = {
      ...updatedInputs[index],
      resolvedAddress: resolved,
    };
    setTransferInput(updatedInputs);
  };

  const handleAddMore = () => {
    if (transferInput.length >= 10) {
      return;
    }

    const newTransferInput = {
      address: "",
      uiAmount: "",
    };
    setTransferInput([...transferInput, newTransferInput]);
  };

  const handleRemove = (index: number | undefined) => {
    const updatedInputs = transferInput.filter((_, i) => i !== index);
    setTransferInput(updatedInputs);
  };

  return (
    <YStack width={"100%"} gap={"$3"}>
      {transferInput.map((item, ix) => (
        <MultiRecipientWalletItem
          key={ix}
          ix={ix}
          item={item}
          handleRemove={handleRemove}
          onAddressChange={(address) => handleAddressChange(ix, address)}
          onAmountChange={(amount) => handleAmountChange(ix, amount)}
          onResolvedAddressChange={(resolved) =>
            handleResolvedAddressChange(ix, resolved)
          }
        />
      ))}

      {transferInput.length < 8 && (
        <Button
          size={"$4"}
          gap={"$2"}
          rounded={"$2"}
          bg={"transparent"}
          onPress={handleAddMore}
          borderColor={"#5D44BE"}
        >
          <Text
            fontWeight={300}
            fontSize={"$2"}
            color={"$secondary"}
          >{`Add Another Wallet (${transferInput.length}/8)`}</Text>

          <PlusIcon color="#CCCFF9" size={10} />
        </Button>
      )}
    </YStack>
  );
}
