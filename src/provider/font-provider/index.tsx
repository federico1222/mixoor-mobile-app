import { useFonts } from "expo-font";
import { PropsWithChildren } from "react";

import {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
} from "@expo-google-fonts/noto-sans";

export function FontsProvider({ children }: PropsWithChildren) {
  const [loaded] = useFonts({
    NotoRegular: NotoSans_400Regular,
    NotoSemi: NotoSans_600SemiBold,
  });

  if (!loaded) return null;

  return <>{children}</>;
}
