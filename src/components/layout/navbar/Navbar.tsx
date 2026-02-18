import { Image, XStack } from "tamagui";
import RightPart from "./RightPart";

export default function Navbar() {
  return (
    <XStack
      width={"100%"}
      borderWidth={2}
      items={"center"}
      justify={"space-between"}
      borderBottomColor={"rgba(64, 53, 122, 0.3)"}
      px={10}
      pt={40}
      pb={20}
    >
      <Image
        width={160}
        height={30}
        objectFit="contain"
        src={require("../../../assets/img/logo-mixoor.png")}
      />

      <RightPart />
    </XStack>
  );
}
