import { TelegramLogo, XLogo } from "phosphor-react-native";
import { UserDeposits } from "../types/user";

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

export const DEPOSITS_MOCK: UserDeposits[] = [
  {
    id: 1,
    createdAt: new Date("2024-02-15").toISOString(),
    uiAmount: "1.5",
    poolAddress: "PoolAddress111111111111111111111111111111111",
    mintAddress: "So11111111111111111111111111111111111111112",
    isSpent: false,
    assetType: "Sol",
    txSignature: "5J8W...", // Opcional
    tokenMetadata: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    },
  },
  {
    id: 2,
    createdAt: new Date("2024-02-18").toISOString(),
    uiAmount: "100.25",
    poolAddress: "PoolAddress222222222222222222222222222222222",
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    isSpent: false,
    assetType: "SplToken",
    txSignature: "3K9X...",
    tokenMetadata: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    },
  },
  {
    id: 3,
    createdAt: new Date("2024-02-20").toISOString(),
    uiAmount: "50000000",
    poolAddress: "PoolAddress333333333333333333333333333333333",
    mintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    isSpent: true,
    assetType: "SplToken",
    tokenMetadata: {
      name: "Bonk",
      symbol: "BONK",
      decimals: 5,
      image: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    },
  },
  {
    id: 4,
    createdAt: new Date("2024-02-22").toISOString(),
    uiAmount: "0.5",
    poolAddress: "PoolAddress444444444444444444444444444444444",
    mintAddress: "So11111111111111111111111111111111111111112",
    isSpent: false,
    assetType: "Sol",
    txSignature: "7P2Q...",
    tokenMetadata: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    },
  },
];
