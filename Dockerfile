FROM node:24

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source
RUN mkdir -p storage/uploads storage/slides/{images,videos} storage/temp
COPY . .

EXPOSE 3333

CMD ["sh", "-c", "node ace migration:run --force && node ace db:seed && node ace serve --hmr"]