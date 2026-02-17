import { useFonts } from "expo-font";
import { PropsWithChildren } from "react";

import {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
} from "@expo-google-fonts/noto-sans";

import {
  BeVietnamPro_400Regular,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from "@expo-google-fonts/be-vietnam-pro";

export function FontsProvider({ children }: PropsWithChildren) {
  const [loaded] = useFonts({
    Noto_400: NotoSans_400Regular,
    Noto_600: NotoSans_600SemiBold,
    Noto_700: NotoSans_700Bold,

    BeVietnam_400: BeVietnamPro_400Regular,
    BeVietnam_600: BeVietnamPro_600SemiBold,
    BeVietnam_700: BeVietnamPro_700Bold,
  });

  if (!loaded) return null;

  return <>{children}</>;
}
