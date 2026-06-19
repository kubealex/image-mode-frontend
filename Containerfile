FROM quay.io/kubealex/image-mode-baseos:latest

ARG API_HOST=localhost

RUN dnf install -y nodejs npm && dnf clean all

COPY package.json package-lock.json* /usr/share/train-tickets/frontend/
RUN cd /usr/share/train-tickets/frontend && npm install

COPY index.html vite.config.js /usr/share/train-tickets/frontend/
COPY src/ /usr/share/train-tickets/frontend/src/

COPY usr/ /usr/

RUN mkdir -p /etc/train-tickets && echo "API_HOST=${API_HOST}" > /etc/train-tickets/frontend.env

RUN systemctl enable train-tickets-frontend.service

RUN firewall-offline-cmd --zone=public --add-port=5173/tcp
