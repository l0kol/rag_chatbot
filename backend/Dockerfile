FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy source files
COPY backend/ .

# Compile Code
RUN npm run build

# Expose port
EXPOSE 3001

# Run the transpiled code
CMD ["node", "dist/index.js"]
