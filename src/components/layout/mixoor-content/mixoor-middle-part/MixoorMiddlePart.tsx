import { Image, XStack } from "tamagui";
import TransferAmountInput from "./TransferAmountInput";

export default function MixoorMiddlePart() {
  return (
    <XStack gap={"$3"} items={"center"}>
      <XStack
        width={52}
        height={52}
        items={"center"}
        justify={"center"}
        bg={"rgba(64, 53, 122, 0.15)"}
        rounded={18}
      >
        <Image
          width={25}
          height={25}
          objectFit="contain"
          src={require("../../../../assets/img/sol.png")}
        />
      </XStack>

      <TransferAmountInput />
    </XStack>
  );
}
