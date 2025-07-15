# app/Dockerfile
FROM node:24-alpine AS build

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .
RUN npm run build

# Serve static files with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
