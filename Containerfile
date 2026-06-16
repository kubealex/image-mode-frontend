FROM quay.io/kubealex/image-mode-baseos:rhel10.1

RUN dnf install -y nodejs npm && dnf clean all

COPY package.json package-lock.json* /usr/share/train-tickets/frontend/
RUN cd /usr/share/train-tickets/frontend && npm install

COPY index.html vite.config.js /usr/share/train-tickets/frontend/
COPY src/ /usr/share/train-tickets/frontend/src/

COPY usr/ /usr/

RUN systemctl enable train-tickets-frontend.service
