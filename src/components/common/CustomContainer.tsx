import { ReactNode } from "react";
import { YStack, type YStackProps } from "tamagui";

type CustomContainerProps = {
  children: ReactNode;
} & YStackProps;

export default function CustomContainer({
  children,
  ...props
}: CustomContainerProps) {
  return (
    <YStack
      pt="$7"
      rounded="$6"
      bg="rgba(64, 53, 122, 0.05)"
      borderWidth={1}
      borderColor="#27272A"
      {...props}
    >
      {children}
    </YStack>
  );
}
