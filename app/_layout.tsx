import { AppProviders } from "@/src/provider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#090b0b" },
          }}
        />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
