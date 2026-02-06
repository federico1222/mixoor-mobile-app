import { tamaguiConfig } from "@/src/config/tamagui";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <Stack />
    </TamaguiProvider>
  );
}
