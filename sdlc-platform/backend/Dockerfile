FROM node:18

WORKDIR /app

# Set NODE_TLS_REJECT_UNAUTHORIZED to bypass SSL issues
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy package files and install dependencies
COPY package*.json ./
RUN npm config set strict-ssl false && npm install --legacy-peer-deps && npm install graphql-scalars class-validator

# Install ts-node globally for development mode
RUN npm config set strict-ssl false && npm install -g ts-node typescript

# Copy source files
COPY . .

# Expose the port the app runs on
EXPOSE 14000

# Run the application in development mode
CMD ["ts-node", "--transpile-only", "src/server.ts"]
