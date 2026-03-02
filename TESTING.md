# Testing StockNews Locally

This document explains every way to run and test the StockNews app on your machine,
from a quick two-command start to platform-specific simulators and physical devices.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 minutes)](#quick-start)
3. [Unit Tests](#unit-tests)
4. [Running on Different Platforms](#running-on-different-platforms)
   - [Web browser](#web-browser)
   - [Physical device with Expo Go](#physical-device-with-expo-go)
   - [iOS Simulator (macOS only)](#ios-simulator-macos-only)
   - [Android Emulator](#android-emulator)
5. [Using a Real API Key](#using-a-real-api-key)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Minimum version | How to install |
|---|---|---|
| Node.js | 18 | https://nodejs.org |
| npm | 9 | ships with Node.js |
| Expo CLI | latest | `npm install -g expo-cli` |
| Git | any | https://git-scm.com |

Optional (only if you want a native build):

| Tool | Platform | How to install |
|---|---|---|
| Xcode (+ Command Line Tools) | macOS | Mac App Store |
| Android Studio + Android SDK | Windows / macOS / Linux | https://developer.android.com/studio |
| Expo Go app | iOS or Android device | App Store / Google Play |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/sudiptoai/stock-news.git
cd stock-news

# 2. Install dependencies
npm install

# 3. Start the dev server (opens an interactive menu in the terminal)
npm start
```

After running `npm start` you will see something like:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

> **No API key required.** The app ships with rich built-in mock data and works
> 100% offline. See [Using a Real API Key](#using-a-real-api-key) if you want
> live market data.

---

## Unit Tests

The test suite covers all formatting and utility helpers (21 tests total).

```bash
# Run once and exit (great for CI or a quick check)
npm test

# Run in watch mode (re-runs on every file save – good for TDD)
npm run test:watch
```

Expected output:

```
 PASS  __tests__/helpers.test.ts
  formatRelativeTime
    ✓ returns "Just now" for timestamps less than 1 minute ago
    ✓ returns minutes when < 1 hour ago
    ...
Tests: 21 passed, 21 total
```

---

## Running on Different Platforms

### Web browser

The fastest way to preview the UI without any mobile tooling:

```bash
npm run web
```

This opens `http://localhost:8081` in your default browser. The full app renders
including all five tabs (News, Stocks, Picks, Watchlist, Goals).

---

### Physical device with Expo Go

1. Install **Expo Go** on your device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Make sure your computer and phone are on the **same Wi-Fi network**.

3. Run:

   ```bash
   npm start
   ```

4. Scan the QR code shown in the terminal:
   - **Android**: open Expo Go and tap "Scan QR code"
   - **iOS**: open the built-in **Camera** app and tap the notification banner

The app loads within a few seconds. Pull-to-refresh and navigation work exactly
as they would in production.

---

### iOS Simulator (macOS only)

Requires Xcode ≥ 14 with a simulator installed.

```bash
# Option A – from the npm start interactive menu, press  i
npm start

# Option B – direct
npm run ios
```

If Xcode is installed but no simulator is open, Expo automatically boots the
default iPhone simulator.

---

### Android Emulator

Requires Android Studio with an AVD (Android Virtual Device) created.

```bash
# Start your AVD first via Android Studio → Device Manager → ▶ Play
# Then in a separate terminal:

# Option A – from the npm start interactive menu, press  a
npm start

# Option B – direct
npm run android
```

Make sure `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) and the `platform-tools/` path
are on your `PATH`. See the
[React Native environment setup](https://reactnative.dev/docs/environment-setup)
for a detailed walkthrough.

---

## Using a Real API Key

The app uses the free [Finnhub API](https://finnhub.io) for live market news,
stock quotes, and analyst recommendations.

1. Register for a free account at https://finnhub.io  
2. Copy your API key from the dashboard  
3. Create a `.env` file at the project root:

   ```bash
   cp .env.example .env
   ```

4. Open `.env` and set:

   ```
   EXPO_PUBLIC_FINNHUB_API_KEY=your_key_here
   ```

5. Restart the dev server (`Ctrl+C` then `npm start`) to pick up the new value.

> **Free tier limits:** 60 requests / minute. The app queries one endpoint
> per tab open and caches results for 1–30 minutes, so normal usage stays
> well within the limit.

---

## Troubleshooting

### `npm start` fails immediately with "Cannot find module"

Run `npm install` first. If it still fails, delete the cache:

```bash
rm -rf node_modules package-lock.json
npm install
```

### QR code doesn't load on device

- Confirm your phone and computer are on the same Wi-Fi network.
- If behind a firewall or VPN, try tunnel mode:

  ```bash
  npm start -- --tunnel
  ```

### Metro bundler shows "Unable to resolve module"

Clear the Metro cache:

```bash
npm start -- --clear
```

### iOS simulator shows white screen

Make sure Xcode Command Line Tools are installed:

```bash
xcode-select --install
```

Then try:

```bash
npx expo doctor   # runs a health-check and suggests fixes
```

### Android build fails with SDK errors

Check that `ANDROID_HOME` points to your SDK directory:

```bash
echo $ANDROID_HOME   # e.g. /Users/you/Library/Android/sdk
```

Add the following to `~/.zshrc` (or `~/.bashrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Expo Go shows "Something went wrong"

1. Shake the device to open the developer menu.
2. Tap **Reload**.
3. If it persists, check the terminal for the full error stack trace.

### Tests fail with "Cannot find module 'react-native'"

The Jest preset transforms React Native modules. Ensure you have installed
all dev dependencies:

```bash
npm install
npm test
```

---

*For more detail on the app architecture, see [README.md](./README.md).*
