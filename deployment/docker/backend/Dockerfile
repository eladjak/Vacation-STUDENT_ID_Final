# Backend Dockerfile
#
# Node.js server configuration for the backend API
# Features:
# - Node.js runtime environment
# - TypeScript compilation
# - Production dependencies only
# - Proper file permissions
# - Security best practices

# Use Node.js LTS version
FROM node:18-alpine

# Create app directory with proper permissions
WORKDIR /app

# Install production dependencies first
COPY server/package*.json ./
RUN npm ci --only=production
RUN npm install class-validator class-transformer @nestjs/common@9.4.3 @nestjs/core@9.4.3 @nestjs/platform-express@9.4.3 @nestjs/typeorm@9.4.3 @nestjs/config@9.4.3

# Copy application source
COPY server/ ./

# Create uploads directory with proper permissions
RUN mkdir -p uploads/vacations && chown -R node:node uploads

# Switch to non-root user
USER node

# Expose API port
EXPOSE 3001

# Start the server
CMD ["npm", "start"] 