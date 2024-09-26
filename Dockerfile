# Build stage
FROM node:18 as build
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build:prod

# Production stage
FROM node:18-slim
WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci 

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]