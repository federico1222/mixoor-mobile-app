import { WALLET_APPS } from "@/src/utils/detectWallets";
import { DetectedWallet } from "@/src/utils/wallet-discovery";
import { ArrowSquareInIcon, X } from "phosphor-react-native";
import { Image, Linking, Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import CustomSheet from "../../common/CustomSheet";

interface WalletSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallets: DetectedWallet[];
  onSelectWallet: (wallet: DetectedWallet) => void;
}

const PACKAGE_TO_WALLET: Record<string, string> = {
  "app.phantom": "Phantom",
  "com.solflare.mobile": "Solflare",
  "app.backpack.mobile": "Backpack",
  "com.wallet.crypto.trustapp": "Trust Wallet",
  "ag.jup.jupiter.android": "Jupiter Mobile",
  "com.luma.wallet.prod": "Glow Wallet",
};

function getWalletInfo(packageName: string, appName: string) {
  const knownName = PACKAGE_TO_WALLET[packageName];
  const walletApp = knownName
    ? WALLET_APPS.find((w) => w.name === knownName)
    : undefined;

  return {
    name: knownName || appName,
    icon: walletApp?.icon,
  };
}

export default function WalletSelectorModal({
  open,
  onOpenChange,
  wallets,
  onSelectWallet,
}: WalletSelectorModalProps) {
  const installedPackages = new Set(wallets.map((w) => w.packageName));
  const installableWallets = WALLET_APPS.filter(
    (w) => !installedPackages.has(w.packageName)
  );

  return (
    <CustomSheet open={open} onOpenChange={onOpenChange} id="wallet-selector">
      <XStack justify="space-between" items="center" mb="$6">
        <Text fontSize={24} fontWeight="700" color="#FAFAFA">
          Select Wallet
        </Text>
        <Pressable onPress={() => onOpenChange(false)}>
          <X size={24} color="#FAFAFA" />
        </Pressable>
      </XStack>

      <Text color="rgba(250, 250, 250, 0.7)" fontSize={14} mb="$6">
        Choose which wallet to connect:
      </Text>

      <YStack gap="$3">
        {wallets.map((wallet) => {
          const info = getWalletInfo(wallet.packageName, wallet.appName);
          return (
            <Pressable
              key={wallet.packageName}
              onPress={() => {
                onOpenChange(false);
                onSelectWallet(wallet);
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <XStack
                bg="$background"
                borderWidth={1}
                borderColor="$primary"
                rounded="$3"
                p="$4"
                items="center"
                gap="$3"
              >
                {info.icon ? (
                  typeof info.icon === "string" ? (
                    <Image
                      source={{ uri: info.icon }}
                      style={{ width: 40, height: 40, borderRadius: 8 }}
                    />
                  ) : (
                    <Image
                      source={info.icon}
                      style={{ width: 40, height: 40, borderRadius: 8 }}
                    />
                  )
                ) : (
                  <YStack
                    width={40}
                    height={40}
                    rounded="$2"
                    bg="$primary"
                    items="center"
                    justify="center"
                  >
                    <Text fontSize={18} fontWeight="700" color="#FAFAFA">
                      {info.name.charAt(0)}
                    </Text>
                  </YStack>
                )}
                <Text fontSize={16} fontWeight="600" color="$text" flex={1}>
                  {info.name}
                </Text>
              </XStack>
            </Pressable>
          );
        })}
      </YStack>

      {installableWallets.length > 0 && (
        <>
          <YStack
            height={1}
            bg="rgba(250, 250, 250, 0.1)"
            my="$6"
          />

          <Text color="rgba(250, 250, 250, 0.7)" fontSize={14} mb="$4">
            Install more wallets:
          </Text>

          <YStack gap="$3">
            {installableWallets.map((wallet) => (
              <Pressable
                key={wallet.name}
                onPress={() => {
                  Linking.openURL(wallet.playStoreUrl);
                }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <XStack
                  bg="$background"
                  borderWidth={1}
                  borderColor="rgba(250, 250, 250, 0.15)"
                  rounded="$3"
                  p="$4"
                  items="center"
                  gap="$3"
                  opacity={0.6}
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
                  <XStack gap="$2" items="center" justify="center">
                    <Text fontSize={14} color="$secondary">
                      Install
                    </Text>
                    <ArrowSquareInIcon color="#CACCFC" size={18} />
                  </XStack>
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </>
      )}
    </CustomSheet>
  );
}
