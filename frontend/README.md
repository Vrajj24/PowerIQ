# PowerIQ frontend

React 19 and TypeScript, built with Vite 8 and Tailwind CSS 4. The interface includes the public homepage, split-layout authentication pages, and account-specific energy workspace.

See the [project README](../README.md) for setup, simulated-data behavior, and deployment details.

## Development

Use Node.js 22.12 or later. Create `.env.local` with `VITE_BACKEND_URL=http://localhost:8080` to connect to the local backend.

```shell
npm ci
npm run dev
```

## Validation

```shell
npm run build
npm run lint
```

`npm run preview` serves the production build locally. Use `npm.cmd` on Windows PowerShell if execution policy blocks `npm`.
