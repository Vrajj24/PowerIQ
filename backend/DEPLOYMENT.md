# Backend configuration

Local development without PostgreSQL:

```shell
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The dev profile uses an isolated in-memory H2 database. Its data resets on restart and does not touch `backend/data`. Tests use their own in-memory database.

For Render, keep the Docker build context at `backend` and the Dockerfile at `backend/Dockerfile` (or `Dockerfile` when the service root directory is `backend`). Use `/api/health` as the health check path. The server listens on `0.0.0.0` and uses Render's `PORT`, falling back to `8080` locally.

Database environment variables depend on the active profile:

| Profile | Required environment variables |
| --- | --- |
| Default | `DB_URL` (a `jdbc:postgresql://...` URL), `DB_USERNAME`, `DB_PASSWORD` |
| `prod` (`SPRING_PROFILES_ACTIVE=prod`) | `POSTGRES_HOST` (optionally including port), `POSTGRES_DATABASE`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |

Do not activate the `dev` profile on Render. A Render `postgresql://...` connection string must be converted to the JDBC format expected by the selected configuration; credentials are supplied separately.

The Docker build currently packages the existing frontend files in `src/main/resources/static`; it does not build `../frontend` automatically.

## Account data

Devices, telemetry, dashboard summaries, analytics, alerts, and CSV exports are scoped to the authenticated account. Device power is stored in watts and converted to kW for summaries and readings; simulated usage estimates use a 60% load factor and a ₹8/kWh tariff.

On the first startup after this update, existing users without the `dataInitialized` flag receive their own copy of the legacy mock devices (or a starter set if there are none) and 30 days of simulated history. Initialization is recorded once, so deleting devices does not cause them to return after a restart. New registrations set the flag immediately and start with no devices or history. The scheduler begins recording only for accounts with devices; offline devices contribute zero load.

Deploy the updated backend and frontend together. The frontend polls account-scoped endpoints rather than listening to shared WebSocket topics. Local fallback sessions use separate browser storage per email: registrations start empty, and existing fallback accounts receive mock devices and history once. API failures for real sessions are shown as errors rather than being replaced with unrelated sample totals.
