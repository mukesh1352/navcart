# Base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the code
COPY . .

# Expose the port your app runs on (update if needed)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
