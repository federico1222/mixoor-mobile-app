import React, { ReactNode } from "react";
import { Sheet } from "tamagui";

interface CustomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  onClose?: () => void;
  id?: string;
  disableDrag?: boolean;
}

export default function CustomSheet({
  open,
  onOpenChange,
  children,
  id,
  disableDrag = false,
}: CustomSheetProps) {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      zIndex={100_000}
      snapPoints={[95, 70, 45]}
      disableDrag={disableDrag}
    >
      <Sheet.Overlay
        onPress={() => onOpenChange(false)}
        backgroundColor="rgba(0, 0, 0, 0.76)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backdropFilter="blur(10px)"
      />

      <Sheet.Frame
        key={`sheet-${id}`}
        bg={"$background"}
        borderTopLeftRadius={24}
        borderTopRightRadius={24}
        py={30}
        px={20}
      >
        <Sheet.ScrollView>{children}</Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
