FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 200000

COPY . .
RUN yarn build


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile --network-timeout 200000

COPY --from=builder /app/dist ./dist

EXPOSE 8080

ENV NODE_OPTIONS="--max-old-space-size=2048"

CMD ["node", "dist/server.js"]
