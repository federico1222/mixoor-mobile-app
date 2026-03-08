import { Image } from "react-native";
import { USDC_MINT, WRAPPED_SOL_MINT_TOKEN_PROGRAM } from "../../constants";

const TOKEN_IMAGES: Record<string, any> = {
  SOL: require("../../assets/img/sol.png"),
  USDC: require("../../assets/img/usdc.png"),
};

const MINT_TO_SYMBOL: Record<string, string> = {
  [WRAPPED_SOL_MINT_TOKEN_PROGRAM]: "SOL",
  [USDC_MINT]: "USDC",
};

interface TokenIconProps {
  symbol?: string;
  remoteUri?: string;
  mintAddress?: string;
  size?: number;
  borderRadius?: number;
}

export default function TokenIcon({
  symbol,
  remoteUri,
  mintAddress,
  size = 20,
  borderRadius = 4,
}: TokenIconProps) {
  const resolvedSymbol = symbol || (mintAddress ? MINT_TO_SYMBOL[mintAddress] : undefined);
  const localImage = resolvedSymbol ? TOKEN_IMAGES[resolvedSymbol] : undefined;

  if (localImage) {
    return (
      <Image
        source={localImage}
        style={{ width: size, height: size, borderRadius }}
        resizeMode="contain"
      />
    );
  }

  if (remoteUri) {
    return (
      <Image
        source={{ uri: remoteUri }}
        style={{ width: size, height: size, borderRadius }}
      />
    );
  }

  return (
    <Image
      source={TOKEN_IMAGES.SOL}
      style={{ width: size, height: size, borderRadius }}
      resizeMode="contain"
    />
  );
}
