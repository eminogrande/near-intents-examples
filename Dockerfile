FROM node:20-alpine AS base
WORKDIR /app

# Install deps separately for better caching
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable && corepack prepare pnpm@10.13.1 --activate && pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f yarn.lock ]; then \
    corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --frozen-lockfile; \
  else \
    npm i; \
  fi

COPY . .

RUN npm run build || pnpm run build || yarn build

EXPOSE 3000
CMD ["npm","run","start"]

