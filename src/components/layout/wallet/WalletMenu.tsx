import { formatAddress } from "@/src/helpers";
import * as Clipboard from "expo-clipboard";
import { Copy, SignOut } from "phosphor-react-native";
import { useState } from "react";
import { Popover, Text, XStack, YStack } from "tamagui";

interface WalletMenuProps {
  trigger: React.ReactNode;
  address: string;
  onDisconnect: () => void;
}

export function WalletMenu({
  trigger,
  address,
  onDisconnect,
}: WalletMenuProps) {
  const [open, setOpen] = useState(false);

  const copyAddress = async () => {
    await Clipboard.setStringAsync(address);
    setOpen(false);
  };

  const handleDisconnect = () => {
    onDisconnect();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Content
        mt={8}
        p={6}
        minW={140}
        rounded={10}
        bg={"#14101B"}
        border={"1px solid #27272A"}
        elevate
      >
        <YStack width={"100%"}>
          <Popover.Close asChild>
            <XStack p={"$2"} onPress={copyAddress} justify={"space-between"}>
              <Text fontFamily={"$mono"} color="$text" fontSize={"$1"}>
                {formatAddress(address, 3, 0, 3) || ""}
              </Text>

              <Copy size={14} color={"#FFFFFF"} />
            </XStack>
          </Popover.Close>

          <Popover.Close asChild>
            <XStack p="$2" justify={"space-between"} onPress={handleDisconnect}>
              <Text fontFamily={"$mono"} color="$text" fontSize={"$1"}>
                Disconnect
              </Text>
              <SignOut size={14} color="#FFFFFF" />
            </XStack>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
