---
name: expo-rn-clean-code
description: Enforces clean code, scalable architecture, and Expo-specific best practices in Expo React Native applications. Use when creating, modifying, reviewing, or refactoring Expo projects. Strictly follows the Expo ecosystem, including Expo Router, Expo SDK, Expo Modules, and EAS. Does not cover standalone React Native CLI projects.
---

# Expo React Native Clean Code

## 1. Core Principles

- Prefer simple, readable, maintainable code over clever abstractions.
- Follow single responsibility and separation of concerns.
- Use feature-first architecture.
- Prefer composition over deeply nested components.
- Avoid duplicated logic and unnecessary dependencies.
- Follow existing project conventions before introducing new patterns.
- Never overengineer simple functionality.

## 2. Expo-First Development

- Always inspect the installed Expo SDK version before making changes.
- Prefer Expo SDK modules over third-party alternatives when suitable.
- Install Expo-compatible dependencies using `npx expo install`.
- Run `npx expo-doctor` and `npx expo install --check` when validating dependencies.
- Never assume Expo Go supports every native dependency.
- Use development builds when native functionality requires them.
- Prefer Expo config plugins over manually modifying generated native files.
- Never introduce React Native CLI-specific setup into an Expo project without an explicit requirement.

## 3. Project Architecture

Prefer feature-first organization.

```text
app/                  # Expo Router routes and layouts
src/
├── features/         # Feature-specific modules
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── schemas/
│       └── types/
├── components/       # Shared UI components
├── hooks/            # Shared hooks
├── lib/              # Infrastructure and integrations
├── providers/        # Application providers
├── theme/            # Design tokens
├── constants/
├── types/
└── utils/
assets/               # Images, fonts, icons
```

Rules:
- Keep `app/` focused on Expo Router navigation and route composition.
- Keep business logic inside feature modules.
- Keep reusable UI inside shared components.
- Keep API communication outside UI components.
- Avoid unnecessary folders and deeply nested structures.
- Use path aliases consistently.

## 4. Expo Router

- Use file-based routing.
- Use `_layout.tsx` for shared navigation configuration.
- Use route groups for authentication and tab-based navigation.
- Use dynamic routes for parameterized screens.
- Keep route files thin.
- Centralize authentication and protected-route logic.
- Use typed routes and navigation parameters where supported.
- Avoid duplicating navigation logic across screens.

## 5. Components, Hooks & TypeScript

### Components
- Components must have a clear responsibility.
- Keep UI components focused on rendering and user interactions.
- Extract reusable UI patterns.
- Use typed component props.
- Avoid oversized components and excessive prop drilling.
- Handle loading, error, empty, and success states.

### Hooks
- Extract reusable stateful logic into custom hooks.
- Keep hooks focused on one responsibility.
- Avoid unnecessary `useEffect`, `useMemo`, and `useCallback`.
- Never call hooks conditionally.
- Do not create abstractions that add complexity without value.

### TypeScript
- Use TypeScript throughout the application.
- Avoid `any`; prefer explicit types and interfaces.
- Type API requests, responses, component props, and navigation parameters.
- Handle null and undefined explicitly.
- Use Zod or equivalent runtime validation for untrusted external data.

## 6. API & State Management

- Centralize HTTP configuration and API communication.
- Never make raw API requests directly inside UI components.
- Keep API functions, business logic, and UI separate.
- Handle errors consistently.
- Avoid exposing tokens or sensitive information in logs.
- Prefer TanStack Query for server-state management when appropriate.
- Use Zustand or Context for shared client state only when needed.
- Use local state for component-specific UI.
- Avoid duplicating server state in global stores.
- Use Expo SecureStore for sensitive client-side token persistence.
- Do not use AsyncStorage for authentication secrets.

## 7. Expo Configuration & Native APIs

- Maintain application configuration through `app.json` or `app.config.ts`.
- Use `EXPO_PUBLIC_` variables only for non-sensitive client-side configuration.
- Never expose private API keys, credentials, or signing secrets.
- Prefer Expo modules such as `expo-image`, `expo-image-picker`, `expo-secure-store`, `expo-notifications`, and `expo-location` where appropriate.
- Request permissions only when required.
- Explain permission requirements to users.
- Handle denied permissions and unsupported device capabilities gracefully.
- Use Expo config plugins for native configuration.
- Understand prebuild implications before modifying native projects.
- Verify API signatures against the installed Expo SDK.

## 8. UI, Performance & Accessibility

- Maintain consistent design tokens for colors, spacing, typography, and radius.
- Use reusable UI components.
- Handle safe areas and keyboard behavior correctly.
- Use `FlatList` or `SectionList` for large collections.
- Avoid unnecessary re-renders and expensive calculations.
- Optimize images and asset loading.
- Clean up subscriptions and event listeners.
- Provide accessibility labels and roles.
- Ensure sufficient contrast and touch target sizes.
- Consider Android and iOS behavioral differences.

## 9. EAS, Testing & Quality

- Maintain separate development, preview, and production build profiles.
- Use EAS Build and EAS Submit where appropriate.
- Use EAS Update only with compatible runtime versions.
- Understand that native dependency or configuration changes may require a new binary.
- Test critical user journeys.
- Write unit and component tests for important business logic and UI behavior.
- Run TypeScript, lint, and relevant test checks.
- Never claim a build or test passed without actually executing it.

## 10. Agent Execution Rules

Before modifying an Expo project:

1. Inspect `package.json`, Expo SDK version, and project structure.
2. Inspect `app.json` / `app.config.ts` and `eas.json` if present.
3. Identify existing navigation, state management, and API patterns.
4. Reuse existing dependencies and architecture where possible.
5. Make focused changes without modifying unrelated files.
6. Validate dependency compatibility and run relevant checks.
7. Summarize modified files, implementation decisions, and verification results.

## Non-Negotiable Rules

- Expo-first, never assume React Native CLI.
- TypeScript-first, avoid `any`.
- Feature-first, maintain separation of concerns.
- No API calls directly inside UI components.
- No secrets in client-side code.
- No unnecessary dependencies or abstractions.
- No unsafe native project modifications.
- No unhandled errors or permissions.
- No unverified build or test claims.

**Goal:** Build Expo applications that are scalable, maintainable, performant, and production-ready without unnecessary complexity.