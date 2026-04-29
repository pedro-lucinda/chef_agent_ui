# React Template

A production-oriented starter for React single-page apps: **Vite**, **TanStack Router** (file-based routes), **TanStack Query**, **Tailwind CSS v4**, and **TypeScript**. Includes **Jest** for unit tests, **Cypress** for end-to-end tests, and a **GitHub Actions** CI pipeline.

## Features

- **React 19** with the Vite React plugin
- **TanStack Router** — routes under `src/routes/` with codegen to `src/routeTree.gen.ts`
- **TanStack Query** — shared `QueryClient` wired in `App.tsx`
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **UI** — Radix primitives, **CVA**, **shadcn**-style patterns, **lucide-react** icons
- **Theming** — `next-themes` with a light/dark/system toggle
- **State** — **Zustand** (example store under `src/store/`)
- **Tooling** — ESLint (TanStack config + Cypress rules), Prettier, path aliases

## Requirements

- **Node.js** 22.x (matches CI)
- **npm** 10+ (this repo uses `package-lock.json` and `npm ci` in CI)

## Getting started

```bash
git clone <your-repo-url>
cd react_template
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server is fixed to port **3000** so it lines up with Cypress and preview.

## Scripts

| Script                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Start Vite dev server on port 3000                    |
| `npm run build`         | Production build to `dist/`                           |
| `npm run preview`       | Serve the production build on port 3000               |
| `npm test`              | Run Jest unit tests once                              |
| `npm run test:watch`    | Jest in watch mode                                    |
| `npm run test:coverage` | Jest with coverage report in `coverage/`              |
| `npm run cypress:open`  | Cypress Test Runner (interactive)                     |
| `npm run cypress:run`   | Cypress headless (expects app already reachable)      |
| `npm run e2e`           | Start dev server, then run Cypress E2E                |
| `npm run e2e:ci`        | Start preview server, then run Cypress (closer to CI) |
| `npm run lint`          | ESLint                                                |
| `npm run format`        | Prettier check                                        |
| `npm run check`         | Prettier write + ESLint fix                           |

## Project structure

```text
src/
  routes/           # TanStack Router file routes
  components/
    pages/          # Route-level page components
    modules/        # Feature modules (e.g. nav bar)
    elements/       # Small reusable pieces (e.g. theme toggle)
    ui/             # Primitives (e.g. Button)
  lib/              # App-wide helpers (theme, query client, utils)
  store/            # Zustand stores
  App.tsx           # Router + providers
  main.tsx          # Entry

cypress/
  e2e/              # Cypress specs (*.cy.ts)
  fixtures/         # Static test data
  support/          # commands.ts, e2e.ts

test/
  setup.ts          # Jest setup (@testing-library/jest-dom)
  mocks/            # CSS / asset stubs for Jest
```

## Path aliases

Imports can use either alias (both map to `src/`):

- `#/components/...`
- `@/components/...`

Configured in `tsconfig.json` / `tsconfig.app.json` and mirrored in `jest.config.ts` for tests.

## Testing

### Unit tests (Jest)

- Config: `jest.config.ts` — **jsdom**, **`@swc/jest`** for TS/JSX, **`@testing-library/react`**
- Colocate tests next to source: `*.test.ts` / `*.test.tsx` under `src/`
- Shared DOM matchers: `test/setup.ts` imports `@testing-library/jest-dom`

### End-to-end tests (Cypress)

- Config: `cypress.config.ts` — `baseUrl` `http://localhost:3000`
- Specs: `cypress/e2e/**/*.cy.ts`
- Local run against dev: `npm run e2e`
- Cypress typings: `cypress/tsconfig.json`

## Continuous integration

Workflow: `.github/workflows/ci.yaml`

1. **Lint, build, unit tests** — `npm ci`, `lint`, `test`, `build`
2. **Cypress E2E** — runs after the first job succeeds; builds, starts `npm run preview`, waits on `http://localhost:3000`, then runs Cypress

Pushes and pull requests to `main` or `master` trigger the workflow.

## Environment

No `.env` is required for the default template. If you add secrets or API URLs, use `.env` (ignored by git) and document variable names here.


