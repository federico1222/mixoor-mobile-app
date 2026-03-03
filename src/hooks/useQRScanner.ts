import { useCameraPermissions } from "expo-camera";
import { useCallback, useState } from "react";

function parseSolanaAddress(data: string): string {
  // Handle Solana Pay format: solana:<address>?amount=...
  if (data.startsWith("solana:")) {
    const withoutPrefix = data.slice(7);
    const questionMark = withoutPrefix.indexOf("?");
    return questionMark >= 0
      ? withoutPrefix.slice(0, questionMark)
      : withoutPrefix;
  }
  return data.trim();
}

export function useQRScanner(onScan: (address: string) => void) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const startScan = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScanned(false);
    setIsScanning(true);
  }, [permission, requestPermission]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    setScanned(false);
  }, []);

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      onScan(parseSolanaAddress(data));
      setIsScanning(false);
    },
    [scanned, onScan]
  );

  return { isScanning, startScan, stopScan, handleBarCodeScanned };
}
