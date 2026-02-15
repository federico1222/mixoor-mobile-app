import { useFonts } from "expo-font";
import { PropsWithChildren } from "react";

import {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
} from "@expo-google-fonts/noto-sans";

import {
  BeVietnamPro_400Regular,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from "@expo-google-fonts/be-vietnam-pro";

export function FontsProvider({ children }: PropsWithChildren) {
  const [loaded] = useFonts({
    NotoRegular: NotoSans_400Regular,
    NotoSemi: NotoSans_600SemiBold,
    BeVietnamRegular: BeVietnamPro_400Regular,
    BeVietnamSemi: BeVietnamPro_600SemiBold,
    BeVietnamBold: BeVietnamPro_700Bold,
  });

  if (!loaded) return null;

  return <>{children}</>;
}
