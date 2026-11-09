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
