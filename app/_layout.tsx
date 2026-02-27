import { AppProviders } from "@/src/provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#090b0b" },
        }}
      />
    </AppProviders>
  );
}
