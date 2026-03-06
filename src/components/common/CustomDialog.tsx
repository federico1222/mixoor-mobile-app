import { ToastOverlay } from "@/src/provider/toast-provider";
import { X } from "phosphor-react-native";
import React from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, YStack, YStackProps } from "tamagui";

type CustomDialogProps = {
  id: string;
  open: boolean;
  trigger: React.ReactNode;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  dialogContentProps?: YStackProps;
};

export default function CustomDialog({
  open,
  setOpen,
  trigger,
  children,
  dialogContentProps,
}: CustomDialogProps) {
  return (
    <>
      {trigger}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <ToastOverlay />
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <YStack
                p={24}
                mx={10}
                rounded={20}
                width="100%"
                bg="$background"
                borderWidth={1}
                borderColor="#27272A"
                {...dialogContentProps}
              >
                {children}

                <Button
                  position="absolute"
                  r="$4"
                  t="$4"
                  size="$4"
                  circular
                  bg="transparent"
                  icon={<X color="white" />}
                  onPress={() => setOpen(false)}
                />
              </YStack>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.60)",
  },
});
