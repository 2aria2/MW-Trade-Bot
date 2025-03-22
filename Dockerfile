# Use official Node.js LTS image as the base image
FROM node:alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install system dependencies and project dependencies
RUN apk add --no-cache \
    bash \
    && npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (adjust if your app uses a different port)
EXPOSE 3000

# Set environment to production - we do not need cross-env since alpine is a known linux distro
ENV NODE_ENV=production

# Install PM2 globally for production deployment
RUN npm install -g pm2

# Use PM2 to start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]