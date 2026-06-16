FROM quay.io/kubealex/image-mode-baseos:latest

ARG API_URL=http://localhost:3001

RUN dnf install -y nodejs npm && dnf clean all

COPY package.json package-lock.json* /usr/share/train-tickets/frontend/
RUN cd /usr/share/train-tickets/frontend && npm install

COPY index.html vite.config.js /usr/share/train-tickets/frontend/
COPY src/ /usr/share/train-tickets/frontend/src/

COPY usr/ /usr/

RUN sed -i "s|Environment=API_URL=.*|Environment=API_URL=${API_URL}|" \
    /usr/lib/systemd/system/train-tickets-frontend.service

RUN systemctl enable train-tickets-frontend.service
