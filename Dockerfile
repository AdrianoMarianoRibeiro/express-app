# Multi-stage build for optimal performance and layer caching
FROM node:18-slim AS base

# Install system dependencies for canvas and puppeteer in a single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Canvas dependencies
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    # Puppeteer dependencies
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    # Build tools for native dependencies
    python3 \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Stage 1: Dependencies installation with caching optimization
FROM base AS dependencies

WORKDIR /app

# Copy package files for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies with caching optimization
# Use npm ci for faster, reliable, reproducible builds
RUN npm ci --verbose --prefer-offline --no-audit

# Stage 2: Build stage
FROM dependencies AS build

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production dependencies only
FROM base AS prod-dependencies

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies and skip problematic packages
# Set environment variables to skip husky installation in production
ENV CI=true \
    HUSKY=0 \
    NODE_ENV=production

# Install production dependencies with optimizations
RUN npm ci --only=production --no-audit --prefer-offline \
    && npm cache clean --force

# Stage 4: Final production image
FROM base AS production

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

WORKDIR /app

# Copy production dependencies from previous stage
COPY --from=prod-dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Add health check for container health monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "run", "start:prod"]