# AGENTS — Quick instructions for AI coding agents

Purpose: Help an AI coding assistant become productive quickly in this repository.

## Quick facts
- Project type: Expo app using `expo-router` (file-based routing).
- Language: TypeScript (strict mode enabled via `tsconfig.json`).

## How to run
- Install dependencies: `npm install` (see [README.md](README.md)).
- Start dev server: `npx expo start` or `npm start`.
- Platform targets: `npm run android`, `npm run ios`, `npm run web`.
- Reset starter state: `npm run reset-project` (see [scripts/reset-project.js](scripts/reset-project.js)).
- Linting: `npm run lint`.

## Key files and directories
- `app/` — App source and file-based routes (entry point for changes).
- `components/` — Reusable UI components.
- `assets/` — Images and static assets.
- `hooks/` — Custom React hooks (e.g., `use-color-scheme`).
- `scripts/reset-project.js` — Helper to reset the repo to a blank starter state.
- `package.json` — Scripts and dependencies.
- `tsconfig.json` — TypeScript settings (note `@/*` path alias).

## Conventions agents should follow
- Use the `app/` directory for screens and routing; do not edit `app-example` (created by `reset-project`).
- Routing uses `expo-router` and `react-navigation`. Look at [app/_layout.tsx](app/_layout.tsx) for the app's root layout.
- Keep TypeScript `strict` rules in mind; prefer typed changes and update types when adding props.
- Use the existing `@/*` path alias when importing project-local modules.

## When making changes or PRs
- Run `npm run lint` before opening a PR.
- If a change affects navigation, verify in `npx expo start` on at least web or an emulator.
- Avoid large automated rewrites of the `app/` filesystem — prefer targeted edits to specific routes or components.

## Useful links
- README: [README.md](README.md)
- Package manifest: [package.json](package.json)
- Root layout: [app/_layout.tsx](app/_layout.tsx)
- Reset script: [scripts/reset-project.js](scripts/reset-project.js)
- TypeScript config: [tsconfig.json](tsconfig.json)

## Suggested next agent customizations
- Create a small `.github/copilot-instructions.md` that references this file and gives policy for running `npm install`, `npx expo start`, and `npm run lint` in CI contexts.
- Add a `skills/` prompt for common tasks: `add-screen`, `refactor-component`, `fix-lint` that codify repo-specific patterns (routing, folder structure, path aliases).

If you want, I can create the `.github/copilot-instructions.md` or add a `skills/` prompt next — tell me which one to create.
