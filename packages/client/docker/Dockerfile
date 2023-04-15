FROM node:18 as builder

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY packages/client packages/client
COPY packages/shared packages/shared
COPY packages/eslint-config packages/eslint-config

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm --filter @villehx/iv-client build

FROM node:18-alpine

COPY --from=builder /app/packages/client/dist dist

EXPOSE 3000
CMD [ "node", "dist/main.js" ]

