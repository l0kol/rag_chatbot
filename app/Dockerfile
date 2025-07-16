# app/Dockerfile
FROM node:24-alpine AS build

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .

ARG VITE_BACKEND_API_URL
RUN echo "VITE_BACKEND_API_URL=${VITE_BACKEND_API_URL}" > .env

RUN npm run build

# Serve static files with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
