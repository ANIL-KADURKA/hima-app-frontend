# Hima frontend

The Hima frontend is a React Native application built with Expo, TypeScript, and Expo Router.

## Requirements

- Node.js 22 or newer
- Corepack, included with Node.js

## Getting started

Enable the pinned pnpm version and install dependencies:

```sh
corepack enable
pnpm install
```

Copy `.env.example` to `.env` when adding local environment values. Expo automatically loads
variables prefixed with `EXPO_PUBLIC_`; do not put secrets in client-side environment variables.

## Phone authentication setup

Phone OTP uses native React Native Firebase Auth and the backend Firebase token-exchange endpoint.
Copy `google-services.json.example` to `google-services.json` and
`GoogleService-Info.plist.example` to `GoogleService-Info.plist`, then replace them with the matching
files downloaded from Firebase Console. The Android package and iOS bundle identifier both come
from `APP_IDENTITY.nativeApplicationId` in `app.config.ts`. To use another Firebase project, add
Android and iOS apps to that project using this application ID and download each platform's matching
config file. A Firebase project can serve multiple app IDs; do not use a config file registered to a
different package or bundle ID. Enable Phone as a sign-in provider and configure Android SHA
fingerprints and iOS APNs for production phone verification. The real Firebase config files are
intentionally ignored by Git.

Set `EXPO_PUBLIC_API_URL` to the backend `/api/v1` URL. The example uses a localhost URL; for the Android emulator use
`http://10.0.2.2:8000/api/v1`. For a physical device, use the development machine's LAN address
and ensure the backend listens on that interface.

Firebase Auth requires a native development build; it does not run in Expo Go. After replacing the
Firebase files, regenerate/rebuild the native app with the Expo config plugins applied (for example,
`pnpm exec expo prebuild` followed by `pnpm exec expo run:android` or `pnpm exec expo run:ios`).
Preserve any local native project changes when regenerating. The OTP route obtains a Firebase ID
token, exchanges it for HIMA session tokens, and stores the session in SecureStore.

## Google Sign-In setup

In Firebase Console, enable Google in Authentication sign-in providers. For Android, add the
SHA-1 fingerprint of the key signing the installed app to the Firebase Android app
(`com.hima.callingpoc`); include the debug keystore fingerprint when testing a debug build. Create
or verify the Android OAuth client for this package and SHA-1, then download a fresh
`google-services.json`. It should include the Android OAuth client and a Web OAuth client for the
same Firebase project. Update both `google-services.json` and `android/app/google-services.json`.

Set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` to that Web application client ID. For iOS, also create an
iOS OAuth client and set `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` to its client ID. Set the backend
`GOOGLE_CLIENT_ID` environment variable to the same Web application client ID; the backend verifies
the Google ID token against this audience.

Google Sign-In also requires a native development build. Rebuild after changing OAuth or Firebase
configuration. The app obtains a Google ID token and exchanges it with
`POST /api/v1/auth/google/`; the resulting HIMA session is stored in SecureStore.

Start the Expo development server:

```sh
pnpm start
```

Use `pnpm android`, `pnpm ios`, or `pnpm web` to open a platform-specific target.

## Quality checks

| Command             | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `pnpm lint`         | Check ESLint rules                                    |
| `pnpm lint:fix`     | Automatically fix ESLint issues                       |
| `pnpm typecheck`    | Run TypeScript without emitting build output          |
| `pnpm format`       | Format supported files with Prettier                  |
| `pnpm format:check` | Check Prettier formatting without changing files      |
| `pnpm check`        | Run TypeScript, ESLint, and formatting checks         |
| `pnpm expo:doctor`  | Check the Expo project configuration and dependencies |

Husky runs lint-staged on staged files before commits and the full `pnpm check` suite before pushes.
GitHub Actions runs the checks and Expo Doctor for pushes and pull requests.

## Project structure

```text
src/
  app/
    _layout.tsx   # Root Expo Router layout
    index.tsx     # Initial route
.vscode/          # Shared editor settings and extension recommendations
.github/
  workflows/      # CI quality checks
```
