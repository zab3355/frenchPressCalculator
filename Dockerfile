# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular SSR application
RUN npm run build

# Remove dev dependencies before handing off to runtime image
RUN npm prune --omit=dev

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy production dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (should match PORT env var)
EXPOSE 4201

# Set default port
ENV PORT=4201

# Start the application
CMD ["node", "dist/french-press-calculator/server/server.mjs"]
