import { defaultConfig } from "@tamagui/config/v5";
import { createFont, createTamagui } from "tamagui";

const bodyFont = createFont({
  family: "NotoRegular",
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
  },
});

const headingFont = createFont({
  family: "BeVietnamBold",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    7: 40,
  },
});

export const tamaguiConfig = createTamagui({
  ...defaultConfig,

  fonts: {
    ...defaultConfig.fonts,
    body: bodyFont,
    heading: headingFont,
    mono: bodyFont,
  },

  tokens: {
    ...defaultConfig.tokens,

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
