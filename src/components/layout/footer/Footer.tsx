import { SOCIAL_MEDIA } from "@/src/data";
import { Linking } from "react-native";
import { Button, Image, Text, XStack, YStack } from "tamagui";
import Feedback from "./Feedback";

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
            src={require("../../../assets/img/logo-mixoor.png")}
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
            <Button
              key={url}
              width={48}
              onPress={() => url && Linking.openURL(url)}
              height={48}
              icon={
                name === "dexscreener" ? (
                  <Image
                    width={18}
                    height={18}
                    objectFit="contain"
                    src={require("../../../assets/img/dex-screener-icon.png")}
                  />
                ) : (
                  Icon && <Icon size={18} color="#CCCFF9" />
                )
              }
              bg="rgba(64,53,122,0.05)"
              borderColor="#27272A"
            />
          ))}
        </XStack>

        <YStack self="center" gap={10} mb={40}>
          <XStack gap={8} justify="center" self="center">
            <Text fontSize={16}>© {new Date().getFullYear()} Mixoor</Text>

            <Text fontSize={16}>-</Text>

            <Text
              fontSize={16}
              color="$color"
              onPress={() => Linking.openURL("https://docs.mixoor.fun")}
            >
              Docs
            </Text>

            <Text fontSize={16}>-</Text>

            <Text
              fontSize={16}
              color="$color"
              onPress={() => Linking.openURL("https://discord.gg/vzBWQJAnxW")}
            >
              Support
            </Text>

            <Text fontSize={16}>-</Text>

            <Feedback />
          </XStack>

          {/* Powered by */}
          <XStack
            self="center"
            gap={4}
            onPress={() => Linking.openURL("https://tools.smithii.io/")}
          >
            <Text fontSize={16} mt={6}>
              Powered by
            </Text>

            <Image
              width={79}
              height={30}
              objectFit="contain"
              src={require("../../../assets/img/smithii-bottom-logo.png")}
            />
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
