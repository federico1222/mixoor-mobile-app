import { createAnimations } from "@tamagui/animations-react-native";
import { defaultConfig } from "@tamagui/config/v5";
import { createFont, createTamagui } from "tamagui";

const bodyFont = createFont({
  family: "Noto",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
  },
  weight: {
    4: "400",
    6: "600",
    7: "700",
  },
  face: {
    400: { normal: "Noto_400" },
    600: { normal: "Noto_600" },
    700: { normal: "Noto_700" },
  },
});

const headingFont = createFont({
  family: "BeVietnam",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    7: 40,
  },
  weight: {
    4: "400",
    6: "600",
    7: "700",
  },
  face: {
    400: { normal: "BeVietnam_400" },
    600: { normal: "BeVietnam_600" },
    700: { normal: "BeVietnam_700" },
  },
});

const animationDriver = createAnimations({
  default: {
    type: "spring",
    damping: 15,
    stiffness: 120,
  },
  quick: {
    type: "spring",
    damping: 20,
    stiffness: 200,
  },
});

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  animations: animationDriver,

  fonts: {
    ...defaultConfig.fonts,
    body: bodyFont,
    heading: headingFont,
    mono: bodyFont,
  },

  tokens: {
    ...defaultConfig.tokens,

    color: {
      primary: "#5D44BE",
      secondary: "#CCCFF9",
      background: "#0C0D11",
      surface: "#1E293B",
      text: "#FFFFFF",
      muted: "#94A3B8",
      danger: "#EF4444",
    },

    space: {
      ...defaultConfig.tokens.space,
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 32,
      8: 40,
    },

    radius: {
      ...defaultConfig.tokens.radius,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
    },

    size: {
      ...defaultConfig.tokens.size,
      1: 12,
      2: 14,
      3: 16,
      4: 18,
      5: 20,
      6: 24,
      7: 32,
    },
  },
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
