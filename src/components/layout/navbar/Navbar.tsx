import { Image, XStack } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";

export default function Navbar() {
  return (
    <XStack
      width={"100%"}
      borderWidth={2}
      justify={"space-between"}
      borderBottomColor={"rgba(64, 53, 122, 0.3)"}
      px={10}
      pt={30}
      pb={20}
    >
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
