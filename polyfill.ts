import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const { install } = require("react-native-quick-crypto");
  install();
}

// @solana/kit checks globalThis.isSecureContext before crypto ops.
// React Native is always a secure native context, so set it to true.
// @ts-expect-error
globalThis.isSecureContext = true;

// ffjavascript (via snarkjs) uses Workers for multi-threading.
// - browser.esm.js checks `globalThis?.Worker` → single-thread when falsy
// - main.cjs checks `process.browser && !globalThis?.Worker` → single-thread
//   when process.browser is true AND Worker is falsy
// Setting both ensures single-thread mode regardless of which build is used.
// @ts-expect-error
globalThis.Worker = globalThis.Worker ?? null;
