import { useSendFeedback } from "@/src/hooks/userUser";
import { useToast } from "@/src/provider";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import {
  Button,
  TamaguiElement,
  Text,
  TextArea,
  YStack,
} from "tamagui";
import CustomDialog from "../../common/CustomDialog";

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const textAreaRef = useRef<TamaguiElement>(null);

  const { toast } = useToast();
  const { mutateAsync, isPending } = useSendFeedback();

  const handleSend = async () => {
    if (!feedback.trim()) return;

    try {
      await mutateAsync({ feedback, wallet: "test" });

      toast({
        type: "success",
        title: "Feedback sent!",
        description: "Feedback sent successfully. Thank you!",
      });

      setFeedback("");
    } catch (error) {
      toast({
        type: "error",
        title: "Error",
        description: `Error sending feedback: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <CustomDialog
      id="feedback"
      open={open}
      setOpen={setOpen}
      trigger={
        <Pressable onPress={() => setOpen(true)}>
          <Text fontSize="$3" color="$color">
            Feedback
          </Text>
        </Pressable>
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text fontSize="$4" color="$color" fontWeight={600}>
          We’d love your feedback
        </Text>

        <YStack my="$3" gap="$4">
          <Text
            width="100%"
            fontSize="$2"
            fontWeight="$4"
            color="#C2C7C9"
          >
            Share your thoughts or suggest features you’d like to see added.
          </Text>

          <TextArea
            ref={textAreaRef}
            size="$5"
            rounded="$3"
            fontSize="$1"
            value={feedback}
            onChangeText={setFeedback}
          />

          <Button
            size="$3"
            mt="$2"
            height="$4"
            rounded="$2"
            bg="#5D44BE"
            disabled={!feedback.trim() || isPending}
            onPress={handleSend}
          >
            {isPending ? "Sending..." : "Send"}
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </CustomDialog>
  );
}
