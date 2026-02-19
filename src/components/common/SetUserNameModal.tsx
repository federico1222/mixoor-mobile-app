import { useMobileWallet } from "@/src/context";
import { avatar } from "@/src/helpers";
import { useSaveUser } from "@/src/hooks/userSaveUser";
import { useUserDetails } from "@/src/hooks/userUser";
import { useToast } from "@/src/provider";
import { WalletIcon } from "phosphor-react-native";
import { TextInput } from "react-native";
import { Button, Image, Text, YStack } from "tamagui";

export default function SetUserNameModal() {
  const {
    saveUser,
    isLoading,
    username,
    setUsername,
    profilePic,
    setProfilePic,
  } = useSaveUser();

  const { toast } = useToast();
  const { refetch } = useUserDetails();
  const { address: walletAddress, disconnect, walletInfo } = useMobileWallet();

  const hasUsername = username.trim().length > 0;

  const handleSaveUsername = async () => {
    if (!hasUsername || !walletAddress) return;

    try {
      await saveUser({
        username: username,
        address: walletAddress,
        profilePic: profilePic,
      });

      toast({
        type: "success",
        title: "Username Saved!",
        description: `Your username "${username}" has been saved successfully.`,
      });

      setUsername("");
      setProfilePic(avatar());
    } catch (err) {
      toast({
        type: "error",
        description: `Failed to save username: ${
          err instanceof Error ? err.message : String(err)
        }`,
      });
    } finally {
      refetch();
    }
  };

  return (
    <YStack
      px={"$3"}
      flex={1}
      items={"center"}
      justify={"center"}
      bg="rgba(0, 0, 0, 0.60)"
      backdropFilter="blur(5px)"
    >
      <YStack
        p="$6"
        width={"100%"}
        rounded={"$6"}
        bg="#09090B"
        border="1px solid #27272A"
      >
        <Text fontSize={"$5"} color="$text" fontWeight={700}>
          Welcome to Mixoor
        </Text>

        <YStack
          pb={2}
          my={40}
          gap={"$4"}
          border={"0.5px solid"}
          borderBottomColor={"#5D44BE"}
        >
          <Text fontSize={"$3"} color="rgba(250, 250, 250, 0.50)">
            Privacy is the most important here, set a public username that will
            appear instead of your wallet on the leaderboard and referral
            system.
          </Text>

          <Text fontSize={"$3"} color={"$text"} style={{ textAlign: "center" }}>
            Set your username
          </Text>

          <TextInput
            style={{
              height: 60,
              backgroundColor: "transparent",
              borderRadius: 12,
              fontWeight: "700",
              color: "#FFF",
              fontSize: 35,
              textAlign: "center",
              fontFamily: "BeVietnam_700",
              outline: "none",
            }}
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
            editable={!isLoading}
            placeholderTextColor="rgba(250, 250, 250, 0.50)"
          />
        </YStack>

        <YStack gap={"$2"}>
          {/* Send Button */}
          <Button
            rounded={"$2"}
            bg="#5D44BE"
            onPress={handleSaveUsername}
            disabled={!hasUsername || isLoading}
          >
            <Text fontWeight={500} color="#CCCFF9">
              {isLoading ? `Saving...` : `Save and close`}
            </Text>
          </Button>

          {/* Disconnect Button */}
          {walletAddress && (
            <Button
              rounded={"$2"}
              bg="#5D44BE"
              onPress={() => {
                disconnect();
              }}
              display="flex"
              items="center"
              gap={7}
            >
              {walletInfo?.icon ? (
                <Image src={walletInfo.icon} width={18} height={18} />
              ) : (
                <WalletIcon color="#CCCFF9" size={18} />
              )}

              <Text
                color="$secondary"
                fontWeight={500}
                position="relative"
                t={1.5}
              >
                Disconnect wallet
              </Text>
            </Button>
          )}
        </YStack>
      </YStack>
    </YStack>
  );
}
