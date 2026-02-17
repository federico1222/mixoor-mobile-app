import { Paragraph, Text, YStack, type YStackProps } from "tamagui";

type MainHeadingProps = {
  title: string;
  desc?: string;
  badgeText?: string;
} & YStackProps;

export default function MainHeading({
  title,
  desc,
  badgeText,
  ...props
}: MainHeadingProps) {
  return (
    <YStack gap="$3" items={"center"} {...props}>
      {badgeText && (
        <Text
          px="$3"
          py="$2"
          rounded="$10"
          color="$secondary"
          fontSize="$2"
          borderWidth={1}
          borderColor="#27272A"
          style={{ textAlign: "center" }}
        >
          {badgeText}
        </Text>
      )}

      <Text
        fontFamily={"$heading"}
        fontWeight={700}
        color="$secondary"
        fontSize={"$5"}
      >
        {title}
      </Text>

      {desc && (
        <Paragraph
          color="#CED0D1"
          fontSize="$3"
          fontWeight={400}
          style={{ textAlign: "center" }}
        >
          {desc}
        </Paragraph>
      )}
    </YStack>
  );
}
