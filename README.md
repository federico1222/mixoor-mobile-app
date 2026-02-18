# Mixoor Mobile App

Mobile app for Mixoor with Solana Mobile Wallet Adapter support.

## Prerequisites

- **pnpm** (package manager)
- **Android Studio** with Android SDK
- **NDK 29.0.14206865** (install via Android Studio → SDK Manager → SDK Tools)
- Environment variables:

```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Setup

1. Install dependencies:

```bash
   pnpm install
```

2. Create `.env` file:

```env
   EXPO_PUBLIC_SOL_RPC_ENDPOINT=...
   EXPO_PUBLIC_MIXOOR_BACKEND_API_ENDPOINT=...
   EXPO_PUBLIC_SOL_RPC_SUBSCRIPTIONS_ENDPOINT=...
```

3. Run on Android:

```bash
   npx expo run:android
```

First build takes ~10 min. After that, changes reload instantly.

## Notes

- MWA only works on Android
- We use `@solana/kit` throughout the codebase with a compatibility layer for MWA
- NDK version is set in `android/gradle.properties`

---

**Package manager:** pnpm only
