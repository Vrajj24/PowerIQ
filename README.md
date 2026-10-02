# PowerIQ

**Good energy. Less guesswork.**

PowerIQ helps you understand what your home uses, what it costs, and which appliances contribute to the load. It combines a responsive energy dashboard with device management, historical charts, alerts, and CSV reports.

The current version uses **simulated energy readings**, not hardware telemetry. The homepage product preview is an interactive demonstration.

## What you can do

- **Manage appliances:** Add, edit, switch on or off, and delete devices, with room and rated-power details.
- **Follow your energy use:** View current load, simulated usage estimates, active devices, and projected costs.
- **Explore trends:** Compare readings over 24 hours, 7 days, or 30 days and see room-level load distribution.
- **Export reports:** Review appliance costs and download account-specific telemetry as CSV.
- **Estimate costs before signing up:** Use the homepage calculator with your own wattage, daily hours, and tariff.

The interface uses warm cream, muted sage, orange accents, and locally bundled typography. The homepage, authentication pages, and workspace adapt to desktop, tablet, and mobile screens.

## How account data works

| Account | Initial state |
| --- | --- |
| New registration | No devices, zero totals, and empty graphs |
| Existing account on first upgrade | Its own mock devices and 30 days of simulated history |
| Account with added devices | Simulated readings generated from its online appliances |

Devices, history, summaries, alerts, and exports belong to the signed-in account. Removing devices persists; restarting the backend does not reseed accounts that have already been initialized. Offline appliances contribute zero active load.

The frontend refreshes account data every five seconds. Dashboard daily and monthly figures are **estimates** based on a 60% load factor; the default dashboard tariff is **INR 8/kWh**. Reports aggregate recorded samples. These figures are demonstrations, not utility-meter measurements.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| Charts and UI | Recharts, Lucide, locally bundled Barlow Condensed, DM Sans, IBM Plex Mono |
| Backend | Java 17, Spring Boot 4.1, Spring Security, JWT, Spring Data JPA |
| Storage | PostgreSQL for deployment; isolated in-memory H2 for development and tests |

## Run locally

Use **Node.js 22.12 or later**, **JDK 17**, and the included Maven wrapper. Start the backend and frontend in separate terminals.

### 1. Clone

```shell
git clone https://github.com/Vrajj24/PowerIQ.git
cd PowerIQ
```

### 2. Start the backend

The `dev` profile needs no PostgreSQL setup:

```shell
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
```

The API runs at `http://localhost:8080`. Check `GET /api/health` to confirm it is running. The development database is in memory, so accounts and devices reset when the backend restarts.

### 3. Start the frontend

Create `frontend/.env.local` with:

```dotenv
VITE_BACKEND_URL=http://localhost:8080
```

Then run:

```shell
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`, register an account, and add your first appliance. In Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

Without `VITE_BACKEND_URL`, the frontend targets `https://poweriq.onrender.com`. Restart Vite after changing environment variables.

### Local fallback sessions

If authentication encounters a network failure, the current frontend can create a local demo session. Its devices and history are stored separately per email in browser storage. New demo registrations start empty; existing demo profiles receive mock data once. These sessions are not backend-authenticated accounts and do not sync to PostgreSQL. API errors for real authenticated sessions are displayed rather than replaced with generic mock totals.

## Check your changes

```shell
# In frontend/
npm run build
npm run lint

# In backend/
./mvnw test
```

Backend tests use an isolated H2 database and cover account isolation, empty new accounts, simulated readings, persistent deletion, and one-time existing-account initialization.

## Deploy

The frontend is configured for Vercel; the backend includes a Dockerfile for Render. Set `VITE_BACKEND_URL` to your deployed backend URL when building the frontend.

The backend honors Render's `PORT`, binds to `0.0.0.0`, and exposes `/api/health`. PostgreSQL settings depend on the active Spring profile. See [backend deployment instructions](backend/DEPLOYMENT.md) for the required environment variables and account-data migration behavior.

Deploy the matching frontend and backend changes together. The backend Dockerfile packages the files already in `backend/src/main/resources/static`; it does **not** automatically build the separate frontend directory.

## Project layout

```text
frontend/src/
  components/     Shared UI, branding, and product preview
  context/        Authentication and account data
  pages/          Homepage, auth, and workspace screens
  services/       API access and local demo storage
backend/src/
  main/java/      Controllers, security, services, and models
  main/resources/ Configuration and packaged static assets
  test/           Backend regression tests
```

Bundled font license files are included in [`frontend/src/assets/fonts`](frontend/src/assets/fonts).
