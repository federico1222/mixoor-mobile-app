# Mixoor Mobile App

Privacy-focused mobile app for Solana transfers. Send tokens (SOL, USDC) privately using zero-knowledge cryptographic proofs (nullifiers, commitments, Poseidon hashing).

## Tech Stack

| Layer           | Technology                                                      |
| --------------- | --------------------------------------------------------------- |
| Framework       | React Native 0.81 + Expo 54 (New Architecture + React Compiler) |
| UI              | React 19, TypeScript 5.9, Tamagui (dark theme)                  |
| Routing         | Expo Router (file-based)                                        |
| Blockchain      | @solana/kit (modern SDK, NOT web3.js legacy)                    |
| Wallet          | @wallet-ui/react-native-kit (Mobile Wallet Adapter)             |
| Data            | TanStack React Query                                            |
| ZK Proofs       | snarkjs + ffjavascript + poseidon-lite                          |
| Package Manager | pnpm 9.9                                                        |

## Prerequisites

- **Node.js** >= 18
- **pnpm** 9.x (`corepack enable && corepack prepare pnpm@9.9.0 --activate`)
- **Android Studio** with Android SDK installed
- **Android NDK** (required by `react-native-quick-crypto`). Install from Android Studio: SDK Manager > SDK Tools > NDK (Side by side)
- **EAS CLI** (optional, for remote builds): `npm install -g eas-cli`
- A Solana wallet installed on the device/emulator (Phantom, Solflare, etc.)

> **Note:** The app uses Mobile Wallet Adapter (MWA), which only works on **Android**. iOS does not support MWA currently.

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd mixoor-mobile-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .sample.env .env
```

Edit `.env` with your values:

| Variable                                     | Description                               | Required |
| -------------------------------------------- | ----------------------------------------- | -------- |
| `EXPO_PUBLIC_SOL_RPC_ENDPOINT`               | Solana RPC endpoint (Helius recommended)  | Yes      |
| `EXPO_PUBLIC_SOL_RPC_SUBSCRIPTIONS_ENDPOINT` | WebSocket RPC for subscriptions           | Yes      |
| `EXPO_PUBLIC_MIXOOR_BACKEND_API_ENDPOINT`    | Mixoor backend API URL                    | Yes      |
| `EXPO_PUBLIC_JUPITER_API_KEY`                | Jupiter API key (token prices)            | No       |
| `NODE_ENV`                                   | Environment (leave empty for development) | No       |

For local development with the backend running on your machine, use `http://10.0.2.2:3040/v1` as the backend endpoint (Android emulator redirects `10.0.2.2` to the host).

### 4. Configure Android SDK

Make sure these environment variables are exported (add to `~/.zshrc` or `~/.bashrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk    # macOS
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 5. Run the app

```bash
# Build and run on Android (first time generates the native build, ~10 min)
pnpm android

# Or start only the dev server (requires a previous build)
pnpm start
```

After the first build, changes reload automatically via hot reload.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm install` | Install dependencies     |
| `pnpm start`   | Start Expo dev server    |
| `pnpm android` | Build and run on Android |
| `pnpm ios`     | Build and run on iOS     |
| `pnpm lint`    | Run ESLint               |

## Build & Deploy (EAS)

The app uses EAS Build to generate remote builds. Profiles are configured in `eas.json`:

| Profile   | Network | Distribution | Command                                          |
| --------- | ------- | ------------ | ------------------------------------------------ |
| `preview` | Mainnet | Internal APK | `eas build --profile preview --platform android` |

The `preview` profile generates a downloadable APK directly (no Google Play required). Production environment variables are configured in `eas.json` under `build.preview.env`.

To download the APK after a build:

```bash
eas build:list --platform android
# Copy the URL from the completed build
```

## Project Structure

```
app/                        # Expo Router pages (file-based routing)
  _layout.tsx               # Root layout: AppProviders -> Stack navigator
  index.tsx                 # Home -> MainScreen

src/
  components/
    common/                 # Reusable (CustomDialog, CustomSheet, CustomTooltip)
    layout/                 # Main layout (AppLayout, Navbar, Footer)
      wallet/               # Wallet UI (ConnectButton, WalletMenu, modals)
      mixoor-content/       # Main content (top/middle/bottom parts, tables)
    screens/                # Full screens (MainScreen)
  provider/                 # Context providers
    app-providers.tsx       # Composition of all providers
    auth-provider/          # Authentication (session, JWT)
    token-provider/         # Balances and tokens
    network-provider/       # Solana network (devnet/mainnet)
    toast-provider/         # Toast notifications
    transfer-input-provider/# Transfer form state
    font-provider/          # Font loading
  hooks/                    # Custom hooks
    useWalletConnect.ts     # Wallet connection
    useAuthenticate.ts      # Auth message signing
    useProgramIxs.ts        # Solana program instructions
    useTransferWithToasts.ts# Transfers with feedback
    useUserBalance.ts       # User balances
    useTransferValidation.ts# Transfer validation
    useQRScanner.ts         # QR scanning for addresses
  services/                 # API layer (HTTP)
    auth.service.ts         # Backend authentication
    transfer.service.ts     # Transfer submission
    deposit.service.ts      # Pool deposits
    user.service.ts         # User data
    pools.service.ts        # Privacy pool info
    proxy.service.ts        # Transaction proxy
  helpers/                  # Pure utilities
    calculations.ts         # Amount and fee calculations
    merkle.ts               # Merkle tree for ZK proofs
    rpc.ts                  # Solana RPC helpers
    misc.ts                 # General utilities
  constants/                # Constants (tokens, addresses, fees, limits)
  config/                   # Configuration (Tamagui theme, env)
  types/                    # TypeScript types
  data/                     # Static data (mock transfers, wallet icons)
  assets/                   # SVGs, images, wallet icons
  utils/                    # Wallet detection

shims/                      # Node.js polyfills for React Native
plugins/                    # Expo plugins (wallet discovery)
patches/                    # pnpm patches (@solana-mobile/mobile-wallet-adapter-protocol)
```

### Provider Stack (order matters)

```
FontsProvider -> TamaguiProvider -> ToastProvider -> QueryClientProvider
  -> NetworkProvider -> MobileWalletProvider -> AuthProvider
    -> TokenProvider -> TransferInputProvider
```

## Main Flow

1. **Connect wallet** -> `useWalletConnect()` (MWA)
2. **Authenticate** -> sign auth message -> `useAuthenticate()` -> `auth.service.ts`
3. **Session** -> JWT stored in AsyncStorage via `AuthProvider`
4. **Balances** -> `TokenProvider` + `useUserBalance()` (React Query)
5. **Transfer** -> token + recipient selection via `TransferInputProvider`
6. **Validation** -> `useTransferValidation()` (minimum amounts, sufficient balance)
7. **Execution** -> `useProgramIxs()` + `transfer.service.ts` (ZK proof generation)
8. **Feedback** -> `useTransferWithToasts()` + React Query cache invalidation

## Important Notes

### Android Only (MWA)

Mobile Wallet Adapter is an Android-only protocol. The app requires a compatible wallet installed on the device (Phantom, Solflare, etc.).

### Polyfills and Shims

React Native lacks Node.js APIs. The `shims/` folder provides stubs for `crypto`, `fs`, `os`, `constants`, `readline`, and `web-worker`. The `polyfill.ts` file initializes `react-native-quick-crypto` and sets `globalThis.isSecureContext` for `@solana/kit`.

**Do not modify `shims/` or `polyfill.ts`** without understanding the implications on cryptographic operations.

### ZK Proofs

Zero-knowledge proof generation (snarkjs/ffjavascript) runs single-threaded on the device. It may take several seconds depending on hardware. Workers are intentionally disabled.

### Metro Config

`metro.config.js` has significant custom configuration:

- Node.js module resolution redirected to shims
- Import interception for `snarkjs` and `ffjavascript` to patch `Blob`
- Package exports enabled (`unstable_enablePackageExports`)
- Resolution conditions: `react-native` > `require` > `default`

### MWA Patch

`@solana-mobile/mobile-wallet-adapter-protocol` is patched via pnpm patches for compatibility with the current setup.

### Key Constants

- `MIN_SOL_UI_AMOUNT = 0.05` SOL
- `MIN_USDC_DEPOSIT = 10` USDC
- Supported tokens: SOL (wrapped), USDC

## Troubleshooting

### `error: unable to resolve module` (crypto, fs, etc.)

Shims are not configured correctly. Verify that `metro.config.js` has `extraNodeModules` pointing to `shims/`.

### Wallet not detected on emulator

Install a wallet (e.g. Phantom APK) on the emulator. The `with-wallet-discovery` plugin needs the wallet installed to discover it.

### `globalThis.isSecureContext is not true`

The `polyfill.ts` file is not executing. Verify that `index.ts` imports `./polyfill` before anything else.

### Build fails with NDK errors

`react-native-quick-crypto` requires Android NDK. Install it from Android Studio: SDK Manager > SDK Tools > NDK (Side by side).

### Transfer takes too long

ZK proof generation is CPU-intensive and runs single-threaded. It's normal for it to take several seconds on mid-range devices.

### `ECONNREFUSED` when connecting to local backend

On Android emulator, use `http://10.0.2.2:<port>` instead of `localhost`. `10.0.2.2` is the host machine alias.

### Corrupted Metro cache

```bash
npx expo start --clear
```

---

**Package manager:** pnpm only
