# Frontend Dockerfile
# 
# Multi-stage build configuration for React application
# Stage 1: Build the React application
# Stage 2: Serve it using Nginx
#
# Features:
# - Multi-stage build for smaller final image
# - Node.js for building
# - Nginx for serving
# - Production-ready configuration

# Stage 1: Build React application
FROM node:18 as build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY deployment/docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 