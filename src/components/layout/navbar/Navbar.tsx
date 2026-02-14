import { Image, XStack } from "tamagui";
import ConnectWalletButton from "../../wallet/ConnectWalletButton";

export default function Navbar() {
  return (
    <XStack width={"100%"} justify={"space-between"} px={10} py={30}>
      <Image
        width={160}
        height={30}
        objectFit="contain"
        src={require("../../../assets/img/logo-mixoor.png")}
      />

      <ConnectWalletButton />
    </XStack>
  );
}
