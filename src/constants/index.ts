import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { address } from "@solana/kit";
import { getClusterFromEndpoint } from "../helpers/misc";
import { UserToken } from "../provider";

export const WRAPPED_SOL_MINT_TOKEN_PROGRAM = address(
  "So11111111111111111111111111111111111111112"
);
export const WRAPPED_SOL_MINT_TOKEN_2022_PROGRAM = address(
  "9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP"
);

// USDC mint address
export const USDC_MINT =
  getClusterFromEndpoint() === "solana:devnet"
    ? address("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
    : address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

export const SOL_TOKEN_CONSTANT: Omit<UserToken, "balance"> = {
  mintAddress: WRAPPED_SOL_MINT_TOKEN_PROGRAM,
  name: "Solana",
  symbol: "SOL",
  description: "Native Solana token",
  supply: 0,
  decimals: 9,
  uri: "",
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
  image: null,
  imageUri:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};

export const USDC_TOKEN_CONSTANT: Omit<UserToken, "balance"> = {
  mintAddress: USDC_MINT,
  name: "USD Coin",
  symbol: "USDC",
  description: "USDC Stablecoin",
  supply: 0,
  decimals: 6,
  uri: "",
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
  image: null,
  imageUri:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
};

export const ADMIN_ADDRESS = address(
  "AdUKMLxLi18EfLqLFQvDaizXmvGoDFaNQfQU681vbTje"
);

export const RELAYER_ADDRESS = address(
  "re1R63DiMLtDyHMAS1ohszqfFTHcF9Q3uEXSYdHzHWU"
);

export const MIXOOR_MINT = address(
  "CdqUsAfihtKntBsXPrFaovYyr642zKmZmLxzwWQfsoar"
);

export const LAMPORTS_PER_SOL = 1_000_000_000n;

export const MIN_RENT_EXEMPTION_SOL = 0.00089088;

export const TOKEN_CREATION_FEE_LAMPORTS = 2039280n;

export const SYSTEM_ACCOUNT_CREATION_FEE_LAMPORTS = 1224960n;

export const MIN_USDC_DEPOSIT = 10;

export const MIN_SOL_UI_AMOUNT = 0.05;

export const MIN_SPL_UI_AMOUNT = 10;
