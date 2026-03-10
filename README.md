# Mixoor Mobile App

Privacy-focused mobile app for Solana. Send SOL and USDC privately using zero-knowledge proofs — no one can trace the link between sender and recipient.

## The Problem

On-chain transactions on Solana are fully transparent. Anyone can track wallet activity, balances, and transfer history. This lack of financial privacy is a barrier for everyday users who want to transact without exposing their entire financial footprint.

## The Solution

Mixoor uses zero-knowledge cryptographic proofs (nullifiers, commitments, Poseidon hashing) to break the on-chain link between sender and recipient. Users deposit tokens into privacy pools and withdraw to any address — without revealing the origin.

## Download APK

Install the app on your Android device:

1. Download the APK from [this link](https://expo.dev/accounts/fedeasaad/projects/mixoor-mobile-app/builds/7b746ec3-4427-4fb6-9bcd-419704a4c2cc)
2. On your device, enable **Install from unknown sources** when prompted
3. Open the `.apk` file and tap **Install**
4. You need a Solana wallet installed (e.g. Phantom)

> **Note:** Android only. A compatible Solana wallet must be installed for the app to work.

## Features

- **Private Transfers** — Send SOL and USDC without exposing sender-recipient links on-chain
- **Zero-Knowledge Proofs** — On-device ZK proof generation using snarkjs and Poseidon hashing
- **Mobile Wallet Adapter** — Native integration with Solana-compatible wallets
- **QR Scanner** — Scan wallet addresses for quick transfers
- **Real-time Balances** — Live balance tracking with automatic price feeds via Jupiter
- **Mobile-First Design** — Built from the ground up for Android with dark theme UI

## Tech Stack

| Layer           | Technology                                                      |
| --------------- | --------------------------------------------------------------- |
| Framework       | React Native 0.81 + Expo 54 (New Architecture + React Compiler) |
| UI              | React 19, TypeScript 5.9, Tamagui (dark theme)                  |
| Routing         | Expo Router (file-based)                                        |
| Blockchain      | @solana/kit (modern SDK)                                        |
| Wallet          | @wallet-ui/react-native-kit (Mobile Wallet Adapter)             |
| Data            | TanStack React Query                                            |
| ZK Proofs       | snarkjs + ffjavascript + poseidon-lite                          |

## How It Works

1. **Connect** your Solana wallet via Mobile Wallet Adapter
2. **Authenticate** by signing a message (no passwords, no accounts)
3. **Deposit** SOL or USDC into a privacy pool
4. **Transfer** to any recipient — the ZK proof ensures no traceable link between deposit and withdrawal
5. **Done** — the recipient receives tokens without any public connection to the sender

## Project Structure

```
app/                        # Expo Router pages (file-based routing)
src/
  components/
    common/                 # Reusable UI (dialogs, sheets, tooltips)
    layout/                 # App layout, navbar, wallet UI
    screens/                # Full screens
  provider/                 # Context providers (auth, tokens, network, toast)
  hooks/                    # Custom hooks (wallet, auth, transfers, balances)
  services/                 # API layer (auth, transfers, deposits, pools)
  helpers/                  # Utilities (calculations, merkle trees, RPC)
  constants/                # Tokens, addresses, fees
  config/                   # Tamagui theme, environment config
shims/                      # Node.js polyfills for React Native (crypto, fs)
plugins/                    # Expo plugins (wallet discovery)
```

## Development Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm start

# Build and run on Android
pnpm android
```

Requires Node.js >= 18, pnpm 9.x, and Android Studio with NDK installed.

---

**Built for the MONOLITH Solana Mobile Hackathon**
