# Repository Guidelines

## Project Structure

GitHub Colorful Contributions is a WXT browser extension with a Svelte 5 popup. `src/entrypoints/popup/` contains the popup and its styles, `src/components/` contains reusable Svelte components, and `src/utils.ts` defines the palettes and saves the selected palette. `src/entrypoints/background.ts` handles popup requests to reinject `public/js/content_script.js`, which recolors the graph on GitHub and supports Isometric Contributions.

`public/icons/` holds extension icons, and `public/_locales/<locale>/messages.json` holds translated strings. The base manifest lives in `wxt.config.ts`, with browser-specific settings in `wxt.config.firefox.ts` and `wxt.config.edge.ts`.

## Build and Development

- `bun install --frozen-lockfile` installs dependencies from `bun.lock` and prepares WXT’s generated types. Reuse Bun’s shared download cache.
- `bun run dev` starts WXT development mode for Chrome. Use `bun run dev:firefox` for Firefox.
- `bun run check` runs Svelte and TypeScript diagnostics.
- `bun run build` builds the Chrome extension into `dist/`. Use `bun run build:firefox` for Firefox.
- `bun run zip:all` packages Chrome, Firefox, and Edge. Use `zip`, `zip:firefox`, or `zip:edge` to package one browser.

## Coding Style

Use two spaces, LF line endings, single quotes, and no semicolons. Use PascalCase for Svelte components (`ColorRadio.svelte`) and camelCase for functions (`setSelectedFill`). Follow the existing Tailwind CSS and daisyUI patterns in the popup. Husky runs `lint-staged` to format staged TypeScript, Svelte, HTML, and CSS files with Prettier.

## Testing

Run `bun run check` and build for the browsers affected by your change. The repository has no automated test suite or coverage threshold. For palette changes, open a GitHub profile and verify that the selected colors persist after switching contribution years and returning to the tab. Check light and dark themes for popup changes and verify Isometric Contributions when changing graph rendering.

## Commits and Pull Requests

Follow the short commit prefixes used in recent history, such as `fix:`, `feat:`, and `chore:`. Describe the user-visible change and how you verified it. Link the related issue when available and include screenshots for visual changes.
