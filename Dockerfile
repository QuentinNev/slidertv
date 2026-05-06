FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p storage/uploads storage/slides/{images,videos} storage/temp

ENV NODE_ENV=production
EXPOSE 3333

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "node ace migration:run --force && node ace db:seed"]
CMD ["npx", "tsx", "bin/server.ts"]
