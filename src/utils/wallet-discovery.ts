import { NativeModules } from "react-native";

export interface DetectedWallet {
  packageName: string;
  appName: string;
}

const WalletDiscovery = NativeModules.WalletDiscovery;

export async function getAvailableWallets(): Promise<DetectedWallet[]> {
  if (!WalletDiscovery) {
    console.warn("[WalletDiscovery] Native module not available");
    return [];
  }
  return WalletDiscovery.getAvailableWallets();
}

export function setTargetWallet(packageName: string): void {
  WalletDiscovery?.setTargetWallet(packageName);
}

export function clearTargetWallet(): void {
  WalletDiscovery?.clearTargetWallet();
}
