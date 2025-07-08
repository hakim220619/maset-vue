ARG VERSION=20.10.0

FROM node:$VERSION-alpine AS base
WORKDIR /app

FROM base AS node_modules

WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install 

FROM base AS app

WORKDIR /app
USER node
COPY --from=node_modules --chown=node:node /app/node_modules /app/node_modules
COPY --chown=node:node ./ /app

CMD ["npm", "run", "dev"]

FROM base AS builder
COPY --from=node_modules /app/node_modules /app/node_modules
COPY --chown=node:node ./ /app
RUN cp .env.production .env && npm run build

# Production stage
FROM nginx:alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]