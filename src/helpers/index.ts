import { address } from "@solana/kit";
import {
  MIN_SOL_UI_AMOUNT,
  MIN_SPL_UI_AMOUNT,
  MIN_USDC_DEPOSIT,
  USDC_MINT,
  WRAPPED_SOL_MINT_TOKEN_PROGRAM,
} from "../constants";
import { WALLET_ICONS } from "../data";
import { UserToken } from "../provider";

export function formatAddress(
  address: string,
  start: number,
  end: number,
  end2: number
) {
  if (!address) return null;
  return (
    address.substring(start, end) +
    "..." +
    address.substring(address.length - end2)
  );
}

export function avatar(): string {
  const randomSeed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/6.x/pixel-art/svg?seed=${randomSeed}&backgroundType=gradientLinear`;
}

export function getWalletIcon(label: string): any {
  return WALLET_ICONS[label] || WALLET_ICONS["phantom-wallet"];
}

export const getMinAmount = (isSol: boolean, symbol: string | undefined) => {
  if (!symbol) return;

  if (isSol) return MIN_SOL_UI_AMOUNT;

  if (symbol === "USDC") {
    return MIN_USDC_DEPOSIT;
  }

  return MIN_SPL_UI_AMOUNT;
};

export const getMintAddress = (selectedToken: UserToken | undefined) => {
  if (!selectedToken) return WRAPPED_SOL_MINT_TOKEN_PROGRAM;

  if (
    selectedToken.mintAddress === WRAPPED_SOL_MINT_TOKEN_PROGRAM.toString() ||
    selectedToken.symbol === "SOL"
  ) {
    return WRAPPED_SOL_MINT_TOKEN_PROGRAM;
  }

  if (
    selectedToken.mintAddress === USDC_MINT.toString() ||
    selectedToken.symbol === "USDC"
  ) {
    return USDC_MINT;
  }

  return address(selectedToken.mintAddress);
};

export function transformIpfsLink(ipfsUri?: string): string {
  if (!ipfsUri) return "";

  if (ipfsUri.startsWith("http://") || ipfsUri.startsWith("https://")) {
    return ipfsUri;
  }

  if (ipfsUri.startsWith("ipfs://")) {
    const cid = ipfsUri.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cid}`;
  }

  if (ipfsUri.startsWith("Qm") || ipfsUri.startsWith("baf")) {
    return `https://ipfs.io/ipfs/${ipfsUri}`;
  }

  const customGateway = "https://my-ipfs-gateway.com";
  if (ipfsUri.includes("/ipfs/")) {
    return `${customGateway}${ipfsUri.split("/ipfs/")[1]}`;
  }

  return ipfsUri;
}
