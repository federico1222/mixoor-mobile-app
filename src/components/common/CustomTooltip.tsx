import React, { ReactNode, useState } from "react";
import { Popover, Text } from "tamagui";

interface CustomTooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  open?: boolean;
}

export default function CustomTooltip({
  content,
  children,
  placement = "top",
  open: controlledOpen,
}: CustomTooltipProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange =
    controlledOpen !== undefined ? undefined : setInternalOpen;

  return (
    <Popover
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement={placement}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Content
        bg="#CCCFF9"
        borderWidth={1}
        p="$2.5"
        rounded="$2"
        enterStyle={{ opacity: 0, scale: 0.95, y: -5 }}
        exitStyle={{ opacity: 0, scale: 0.95, y: -5 }}
        elevate
        style={{ zIndex: 100000 }}
      >
        <Popover.Arrow />
        {typeof content === "string" ? (
          <Text fontSize={12} color={"$background"}>
            {content}
          </Text>
        ) : (
          content
        )}
      </Popover.Content>
    </Popover>
  );
}
