import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, YStack } from "tamagui";
import { Footer } from "../layout/footer/Footer";
import Navbar from "../layout/navbar/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["userTransfers"] }),
      queryClient.invalidateQueries({ queryKey: ["userDeposits"] }),
      queryClient.invalidateQueries({ queryKey: ["userSolBalance"] }),
      queryClient.invalidateQueries({ queryKey: ["userTokenBalance"] }),
      queryClient.invalidateQueries({ queryKey: ["userDetails"] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  return (
    <ScrollView
      flex={1}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#CACCFC"
          colors={["#CACCFC"]}
        />
      }
    >
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
