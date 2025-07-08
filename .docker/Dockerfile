ARG VERSION=20.10.0

FROM node:$VERSION-alpine AS base
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

# Development dependencies (with devDependencies)
FROM base AS dev_deps
COPY package.json package-lock.json ./
RUN npm install

# Production dependencies (only production deps)
FROM base AS prod_deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Development runtime
FROM base AS development
ENV NODE_ENV=development
USER node
COPY --chown=node:node --from=dev_deps /app/node_modules /app/node_modules
COPY --chown=node:node . .
CMD ["npm", "run", "dev"]

FROM base AS app
ENV NODE_ENV=development
WORKDIR /app
USER node
COPY --from=node_modules --chown=node:node /app/node_modules /app/node_modules
COPY --chown=node:node ./ /app

CMD ["npm", "run", "dev"]

FROM base AS builder
COPY --from=dev_deps /app/node_modules /app/node_modules
COPY --chown=node:node ./ /app
COPY .env.production .env 
RUN npm run build

# Production stage
FROM nginx:alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]