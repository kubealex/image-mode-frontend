# Image Mode - Frontend

React 18 + Vite + PatternFly 6 frontend for the Train Tickets booking application, packaged as a RHEL bootc image-mode container.

## Features

- **Book Ticket** - Search trains by route, select a service, and book
- **My Tickets** - View and manage booked tickets
- **Database** - Live schema introspection from PostgreSQL
- **Status** - Health check dashboard for all tiers

## Configuration

The frontend proxies `/api` requests to the backend. The backend hostname is read from the `API_HOST` environment variable (default: `localhost`).

### Container / Image Mode

The hostname is baked into the image at build time via a `.env` file. To override at runtime, create `/etc/train-tickets/frontend.env`:

```env
API_HOST=backend-hostname
```

### Local Development

```bash
cd frontend
npm install
API_HOST=your-backend-host npm run dev
```

## Build

```bash
podman build -t quay.io/kubealex/image-mode-frontend:v1.0 .
```

With a custom backend hostname baked into the image:

```bash
podman build --build-arg API_HOST=backend.example.com \
  -t quay.io/kubealex/image-mode-frontend:v1.0 .
```

| Build ARG | Default | Description |
|-----------|---------|-------------|
| `API_HOST` | `localhost` | Backend API hostname |

Base image: `quay.io/kubealex/image-mode-baseos:latest`
