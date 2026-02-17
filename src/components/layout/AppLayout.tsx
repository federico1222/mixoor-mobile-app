import React from "react";
import { ScrollView, YStack } from "tamagui";
import { Footer } from "../layout/footer/Footer";
import Navbar from "../layout/navbar/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <YStack flex={1} bg="#090b0b" mt={20}>
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        {children}

        {/* Footer */}
        <Footer />
      </YStack>
    </ScrollView>
  );
}
