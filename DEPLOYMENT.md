# Deployment Handoff — UC San Diego Passports Visitor Management

## App

- **Name / one-line purpose:** Passports visitor check-in and queue management for UC San Diego Passport Services (CSC and Bookstore locations).
- **Repo:** https://github.com/shark-nado/passports-app — private? Public
- **Image:** `ghcr.io/shark-nado/passports-app` — build workflow status: ✅
- **Stack:** Python/FastAPI + SQLite (aiosqlite), React/Vite SPA served from the same container

## Configuration

| Env var | Purpose | Example (non-secret) | Secret? |
|---|---|---|---|
| `DATABASE_URL` | SQLite database path | `sqlite+aiosqlite:////data/passports.db` | no |
| `JWT_SECRET` | Signing key for auth tokens | — | **yes — install as Secret** |

- **Secrets needed:** `passports-app-secrets` with key `JWT_SECRET` (a random 64-char hex string). Create it before install if it does not already exist:
  ```bash
  kubectl create secret generic passports-app-secrets \
    --from-literal=JWT_SECRET="$(openssl rand -hex 32)" \
    --dry-run=client -o yaml | kubectl apply -f -
  ```
- **Storage:** SQLite database at `/data/passports.db`, expected size 1Gi. Litestream enabled — live DB on node-local `emptyDir`, direct NFS mounted at `/replica` as the replica target.
- **Runtime UID/GID:** `podSecurityContext.runAsUser`, `runAsGroup`, and `fsGroup` must be filled from the deploying user's `id -u`/`id -g`.

## Default credentials (seeded on first run)

- CSC location password: `csc1960`
- Bookstore location password: `book1960`

These are seeded into the database on first startup and can be changed after login.

## Ride-along services

None. Single-container app.

## Helm chart

- Generic chart source: `vendor/UCSD-Skills-Library/skills/ucsd-dsmlp-deploy/assets/helm-chart`
- Passports app values: `deploy/passports-values.yaml`
- Clone with submodules via `git clone --recurse-submodules https://github.com/shark-nado/passports-app.git`, or run `git submodule update --init --recursive` after cloning.
- The app does not carry a copied chart. Render the generic submodule chart with the Passports values file.
- `helm lint vendor/UCSD-Skills-Library/skills/ucsd-dsmlp-deploy/assets/helm-chart -f deploy/passports-values.yaml` passes; `helm template` passes when deploy-time NFS, UID/GID, and ingress host values are supplied.
- Litestream is enabled for safe SQLite on NFS storage. `helm template` intentionally fails until `nfs.server`, `nfs.path`, `nfs.subPath`, `podSecurityContext.runAsUser`, `podSecurityContext.runAsGroup`, `podSecurityContext.fsGroup`, and `ingress.host` are filled in.
- Fill direct NFS values from the deploying user's DSMLP home directory:
  - On DSMLP login, create the directory before deploying, for example `mkdir -p "$HOME/passports-app"`.
  - Run `cd "$HOME/passports-app" && pwd` from the app data directory.
  - Run `df -h .` to get the NFS export. Example: `its-dsmlp-fs03.ucsd.edu:/export/home` mounted at `/dsmlp/home-fs03`.
  - Set `nfs.server` to the host before `:`; example `its-dsmlp-fs03.ucsd.edu`.
  - Set `nfs.path` to the export after `:`; example `/export/home`.
  - Set `nfs.subPath` to the app directory path relative to the mount point; example if `pwd` is `/dsmlp/home-fs03/AA/BBB/$USER/passports-app`, use `AA/BBB/$USER/passports-app`.
  - Set `podSecurityContext.runAsUser` to `id -u`; set `podSecurityContext.runAsGroup` and `podSecurityContext.fsGroup` to `id -g`.
  - Set `ingress.host` to the route assigned for the app.
  - Ensure the directory is writable by the configured `podSecurityContext` UID/GID.
  - DSMLP home directories have a default quota of 10GB; request a quota expansion if the Litestream replica needs more space.
- `ingress.annotations.nginx.org/proxy-buffering="False"` by default for the `/events` SSE endpoint.
- Default scheduling targets any DSMLP student-partition node via `advanced.nodeSelector.dsmlp/partition=student` and matching `node-type=student:NoSchedule` toleration.
- The app defaults to resource requests of `cpu: 100m` and `memory: 256Mi`; container limits default to the final request values unless `advanced.resources.limits` overrides them.
- Lower-frequency operator controls live directly under `advanced` (`envFrom`, `extraVolumes`, `extraVolumeMounts`, `resources`, `nameOverride`, `fullnameOverride`, `imagePullSecrets`, `securityContext`, `nodeSelector`, `tolerations`, and `affinity`).

Example render command:

```bash
helm template passports-app vendor/UCSD-Skills-Library/skills/ucsd-dsmlp-deploy/assets/helm-chart \
  -f deploy/passports-values.yaml \
  --set nfs.server=its-dsmlp-fsXX.ucsd.edu \
  --set nfs.path=/export/home \
  --set nfs.subPath=AA/BBB/$USER/passports-app \
  --set podSecurityContext.runAsUser="$(id -u)" \
  --set podSecurityContext.runAsGroup="$(id -g)" \
  --set podSecurityContext.fsGroup="$(id -g)" \
  --set ingress.host=passports.example.ucsd.edu
```

## Access & data

- **Audience:** campus-only (default)
- **Login needed?** yes (location-based JWT auth via password) — no SAML/OAuth; flag to platform team if auth proxy integration is desired
- **Data classification:** P1/P2 only confirmed? yes — visitor names, emails, phone numbers (contact info for passport service appointments; no SSN, no financial data, no health info)

## API reference

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/checkin` | Public |
| GET | `/api/visitors` | JWT |
| PATCH | `/api/visitors/:id/status` | JWT |
| PATCH | `/api/visitors/:id/notes` | JWT |
| GET | `/api/visitors/export` | JWT |
| GET | `/api/questions` | Public |
| PUT | `/api/questions` | JWT |
| GET | `/api/stats` | JWT |
| GET | `/api/health` | Public |
| GET | `/events` | JWT (SSE, query param `?token=...&location=...`) |

## Contact

- **Developer / owner:** Ben Pollak (bpollak@ucsd.edu)
- **Best way to reach for review questions:** GitHub issues or email
