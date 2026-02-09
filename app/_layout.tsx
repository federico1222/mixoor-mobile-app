import { Footer } from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";
import { tamaguiConfig } from "@/src/config/tamagui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { TamaguiProvider, YStack } from "tamagui";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <YStack flex={1} bg={"#090b0b"}>
          {/* Navbar */}
          <Navbar />

          {/* Main Screen / Stack Navigator */}
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#090b0b" },
            }}
          />

          {/* Footer  */}
          <Footer />
        </YStack>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
