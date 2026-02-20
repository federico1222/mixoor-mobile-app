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

export const MOCK_TRANSFERS = [
  {
    txSignature: "tx1",
    depositId: "dep1",
    createdAt: "2026-02-15T10:30:00Z",
    recipientAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    uiAmount: "150.00",
    multiRecipients: null,
    errorReason: null,
    tokenMetadata: {
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    },
  },
  {
    txSignature: "tx2",
    depositId: "dep2",
    createdAt: "2026-02-16T14:00:00Z",
    recipientAddress: null,
    uiAmount: "300.00",
    multiRecipients: [
      { address: "addr1" },
      { address: "addr2" },
      { address: "addr3" },
    ],
    errorReason: null,
    tokenMetadata: {
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    },
  },
  {
    txSignature: "tx3",
    depositId: "dep3",
    createdAt: "2026-02-17T09:15:00Z",
    recipientAddress: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5CE43H6DkE2",
    uiAmount: "75.50",
    multiRecipients: null,
    errorReason: "Insufficient funds",
    tokenMetadata: {
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    },
  },
  {
    txSignature: "tx4",
    depositId: "dep3",
    createdAt: "2026-02-17T09:15:00Z",
    recipientAddress: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5CE43H6DkE2",
    uiAmount: "75.50",
    multiRecipients: null,
    errorReason: "Insufficient funds",
    tokenMetadata: {
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    },
  },
];
