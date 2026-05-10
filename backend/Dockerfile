# Multi-stage build for production-ready image

# Stage 1: Build
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .
# Generate Prisma Client
RUN bunx prisma generate
# Build TypeScript (if you add a build script)
# RUN bun run build
# Stage 2: Production
FROM oven/bun:1.3-alpine AS production
WORKDIR /app
# Install production dependencies only
COPY package.json bun.lock* ./
RUN bun install --production --frozen-lockfile
# Copy built files from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
# Expose port
EXPOSE 5000
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"
# Run migrations and start server
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/server.ts"]