import { InfoIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { Button, Sheet, Text, View, XStack, YStack } from "tamagui";

export default function MixoorHowToUse() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View items={"center"} justify={"center"}>
      <XStack items={"center"} onPress={() => setOpen(true)}>
        <InfoIcon color={"#FFFFFF"} size={20} />
      </XStack>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        dismissOnSnapToBottom={false}
        dismissOnOverlayPress={true}
        zIndex={100_000}
        snapPoints={[92]}
        disableDrag={false}
      >
        <Sheet.Overlay
          backgroundColor="rgba(0, 0, 0, 0.76)"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backdropFilter="blur(10px)"
        />

        <Sheet.Frame
          bg={"$background"}
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          pt={24}
          pb={Math.max(insets.bottom + 16, 24)}
          px={20}
          flex={1}
        >
          {/* Fixed header */}
          <XStack width={"100%"} self={"center"} justify={"center"} mb={"$4"}>
            <XStack
              width={48}
              height={48}
              rounded={"$2"}
              items={"center"}
              justify={"center"}
              border="1px solid"
              bg={"rgba(64, 53, 122, 0.05)"}
              borderColor={"rgba(39, 39, 42, 1)"}
            >
              <InfoIcon color={"#CCCFF9"} size={20} />
            </XStack>
          </XStack>

          <Text fontSize={24} color="$color" fontWeight={700} mb={"$4"}>
            How to use Mixoor?
          </Text>

          {/* Scrollable content */}
          <Sheet.ScrollView flex={1} showsVerticalScrollIndicator={true}>
            <YStack px={"$2"} gap={"$3"} pb={"$4"}>
              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                Sending funds privately in Mixoor is as simple as doing 3
                clicks:
              </Text>

              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                1. Connect your wallet.
              </Text>

              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                2. Set sending amount and recipient wallet.
              </Text>

              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                3. Click `Send Privately` and confirm the transaction on your
                wallet.
              </Text>

              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                4. Funds will be sent to the recipient wallet in a few seconds
                without showing any link betweek wallets.
              </Text>

              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                If you want to see a video tutorial check here:
              </Text>

              <View
                style={{
                  height: 180,
                  marginTop: 14,
                  borderRadius: 24,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(64, 64, 71, 1)",
                }}
              >
                <YoutubePlayer
                  height={250}
                  play={false}
                  videoId="qYjgoOYYI8o"
                />
              </View>

              <Text fontSize={"$3"} mt={14} fontWeight={400} color={"$text"}>
                In the <Text fontWeight={700}>delayed transfer </Text>
                feature, the process is the same.
              </Text>

              <Text fontSize={"$3"} fontWeight={400} color={"$text"}>
                But instead of sending the funds directly, they will be
                deposited in our Smart Contract. You can withdraw anytime to the
                recipient wallet you select.
              </Text>
            </YStack>
          </Sheet.ScrollView>

          {/* Fixed close button — always visible */}
          <Button
            mt={12}
            height={44}
            width={"100%"}
            outline={"none"}
            onPress={() => setOpen(false)}
            bg={"rgba(93, 68, 190, 1)"}
          >
            <Text fontWeight={500}>Close</Text>
          </Button>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
