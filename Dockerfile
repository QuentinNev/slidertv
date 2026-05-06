# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application and necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/inertia ./inertia
COPY --from=builder /app/public ./public
COPY --from=builder /app/start ./start
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database

# Create storage directory for uploads and database
RUN mkdir -p storage/uploads storage/slides/{images,videos} storage/temp

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3333

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "build/index.js"]
