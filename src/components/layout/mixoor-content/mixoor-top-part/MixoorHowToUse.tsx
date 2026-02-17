import CustomSheet from "@/src/components/common/CustomSheet";
import { InfoIcon } from "phosphor-react-native";
import React, { useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { Button, ScrollView, Text, View, XStack, YStack } from "tamagui";

export default function MixoorHowToUse() {
  const [open, setOpen] = useState(false);
  return (
    <View items={"center"} justify={"center"}>
      <XStack items={"center"} onPress={() => setOpen(true)}>
        <InfoIcon color={"#FFFFFF"} size={20} />
      </XStack>

      <CustomSheet
        id="feedback"
        open={open}
        onOpenChange={setOpen}
        disableDrag={true}
      >
        <XStack width={"100%"} self={"center"} justify={"center"}>
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

        <Text fontSize={24} color="$color" fontWeight={700} mt={"$6"}>
          How to use Mixoor?
        </Text>

        <ScrollView maxH={600} showsVerticalScrollIndicator={true}>
          <YStack mt={24} px={"$2"}>
            <YStack gap={"$3"}>
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
          </YStack>
        </ScrollView>

        <Button
          mt={40}
          height={44}
          width={"100%"}
          outline={"none"}
          onPress={() => setOpen(false)}
          bg={"rgba(93, 68, 190, 1)"}
        >
          <Text fontWeight={500}>Close</Text>
        </Button>
      </CustomSheet>
    </View>
  );
}
