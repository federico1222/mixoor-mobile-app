import { SOCIAL_MEDIA } from "@/src/data";
import { Linking, Pressable } from "react-native";
import { Button, Image, Text, XStack, YStack } from "tamagui";

export function Footer() {
  return (
    <YStack bg="rgba(64,53,122,0.15)" flexDirection="column">
      <YStack width={"100%"} my={20} p={24} gap={80}>
        {/* Logo + tagline */}
        <YStack gap={12} self={"flex-start"}>
          <Image
            width={160}
            height={30}
            objectFit="contain"
            src={require("../../assets/img/logo-mixoor.png")}
          />

          <Text fontSize={16} color="rgba(250,250,250,0.5)">
            Privacy is not an optional feature
          </Text>
        </YStack>

        {/* Description  */}
        <YStack gap={12}>
          <Text fontSize={18} fontWeight="700" color="#FAFAFA">
            How Mixoor works
          </Text>

          <Text fontSize={16} color="rgba(250,250,250,0.5)">
            Mixoor allows you to transfer funds without any visible connection
            on blockchain explorers.
          </Text>

          <Text fontSize={16} color="rgba(250,250,250,0.5)">
            Our system uses a Solana Program (aka Smart Contract) with Merkle
            Trees, Encrypted Data, and a Decentralized Indexer to deliver
            privacy.
          </Text>
        </YStack>
      </YStack>

      <YStack
        width="100%"
        py={20}
        gap={24}
        borderTopWidth={1}
        borderTopColor="#27272A"
        self="center"
      >
        {/* Social icons */}
        <XStack gap={24} self={"center"}>
          {SOCIAL_MEDIA.map(({ name, icon: Icon, url }) => (
            <Pressable
              key={name}
              disabled={!url}
              onPress={() => url && Linking.openURL(url)}
            >
              <Button
                width={48}
                height={48}
                icon={
                  name === "dexscreener" ? (
                    <Image
                      width={18}
                      height={18}
                      objectFit="contain"
                      src={require("../../assets/img/dex-screener-icon.png")}
                    />
                  ) : (
                    Icon && <Icon size={18} color="#CCCFF9" />
                  )
                }
                bg="rgba(64,53,122,0.05)"
                borderColor="#27272A"
              />
            </Pressable>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
