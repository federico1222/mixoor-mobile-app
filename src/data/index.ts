import { TelegramLogo, XLogo } from "phosphor-react-native";

export const SOCIAL_MEDIA = [
  {
    name: "x",
    icon: XLogo,
    url: "https://x.com/Mixoordotfun",
  },
  {
    name: "telegram",
    icon: TelegramLogo,
    url: "https://t.me/+WeK0Zed7210wNTdk",
  },
  {
    name: "dexscreener",
    url: "https://dexscreener.com/solana/cgyaq6iwbj9ke2x8ga7jbypkb5x4umg4dm6rvgkkzska",
  },
];

export const DEFAULT_INPUT = [
  { address: "", uiAmount: "" },
  { address: "", uiAmount: "" },
];

export const WALLET_ICONS: Record<string, any> = {
  "phantom-wallet": require("../assets/wallets/phantom.png"),
  "solflare-wallet": require("../assets/wallets/solflare.png"),
  "metamask-wallet": require("../assets/wallets/metamask.png"),
};
