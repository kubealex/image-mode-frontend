# Image Mode - Frontend

React 18 + Vite + PatternFly 6 frontend for the Train Tickets booking application, packaged as a RHEL bootc image-mode container.

## Features

- **Book Ticket** - Search trains by route, select a service, and book
- **My Tickets** - View and manage booked tickets
- **Database** - Live schema introspection from PostgreSQL
- **Status** - Health check dashboard for all tiers

## Configuration

The frontend proxies `/api` requests to the backend. Configure the backend URL:

### Container / Image Mode

Create `/etc/train-tickets/frontend.env`:

```env
API_URL=http://backend-hostname:3001
```

The systemd service reads this file on startup. Values in this file override the defaults.

### Local Development

```bash
cd frontend
npm install
API_URL=http://your-backend:3001 npm run dev
```

If `API_URL` is not set, it defaults to `http://localhost:3001`.

## Build

```bash
podman build -t quay.io/kubealex/image-mode-frontend:v1.0 .
```

With a custom backend URL baked into the image:

```bash
podman build --build-arg API_URL=http://backend.example.com:3001 \
  -t quay.io/kubealex/image-mode-frontend:v1.0 .
```

| Build ARG | Default | Description |
|-----------|---------|-------------|
| `API_URL` | `http://localhost:3001` | Backend API URL for the Vite proxy |

Base image: `quay.io/kubealex/image-mode-baseos:latest`
