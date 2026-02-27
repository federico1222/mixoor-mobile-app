import { WALLET_APPS } from "@/src/utils/detectWallets";
import { ArrowSquareInIcon, X } from "phosphor-react-native";
import { Image, Linking, Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import CustomSheet from "../../common/CustomSheet";

interface InstallWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstallWalletModal({
  open,
  onOpenChange,
}: InstallWalletModalProps) {
  return (
    <CustomSheet open={open} onOpenChange={onOpenChange} id="install-wallet">
      <XStack justify="space-between" items="center" mb="$6">
        <Text fontSize={24} fontWeight="700" color="#FAFAFA">
          Install a Wallet
        </Text>
        <Pressable onPress={() => onOpenChange(false)}>
          <X size={24} color="#FAFAFA" />
        </Pressable>
      </XStack>

      <Text color="rgba(250, 250, 250, 0.7)" fontSize={14} mb="$6">
        Choose a wallet to install:
      </Text>

      <YStack gap="$3">
        {WALLET_APPS.map((wallet) => (
          <Pressable
            key={wallet.name}
            onPress={() => {
              Linking.openURL(wallet.playStoreUrl);
              onOpenChange(false);
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <XStack
              bg="$background"
              borderWidth={1}
              borderColor={"$primary"}
              rounded="$3"
              p="$4"
              items="center"
              gap="$3"
            >
              {typeof wallet.icon === "string" ? (
                <Image
                  source={{ uri: wallet.icon }}
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
              ) : (
                <Image
                  source={wallet.icon}
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
              )}
              <Text fontSize={16} fontWeight="600" color="$text" flex={1}>
                {wallet.name}
              </Text>
              <XStack gap={"$2"} items={"center"} justify={"center"}>
                <Text fontSize={16} color="$secondary">
                  Install
                </Text>

                <ArrowSquareInIcon color="#CACCFC" />
              </XStack>
            </XStack>
          </Pressable>
        ))}
      </YStack>
    </CustomSheet>
  );
}
