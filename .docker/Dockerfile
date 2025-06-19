ARG VERSION=20.10.0

FROM node:$VERSION-alpine AS base
WORKDIR /app

FROM base AS builder

WORKDIR /app
COPY ./package.json /app/package.json

RUN npm install

FROM base AS app

WORKDIR /app
USER node
COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
COPY --chown=node:node ./ /app

CMD ["npm", "run", "dev"]