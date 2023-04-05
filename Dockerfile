FROM node:18-slim as base

RUN npm install -g pnpm@8
RUN apt-get update && apt-get install -y \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ----

FROM base AS dependencies

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY package.json prisma/ .npmrc ./
RUN pnpm install -r --offline

# ----

FROM base as build

ARG NODE_ENV=production

WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm prisma generate && pnpm build && pnpm prune --prod

# ----

FROM base AS deploy

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/build/ ./build/
COPY --from=build /app/package.json ./package.json

CMD [ "node", "build/index.js" ]
