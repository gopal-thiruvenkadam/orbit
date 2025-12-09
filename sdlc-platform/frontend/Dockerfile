FROM node:18

WORKDIR /app

# Set NODE_TLS_REJECT_UNAUTHORIZED to bypass SSL issues
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Expose the port the app runs on (React default)
EXPOSE 13000

# Start the app in development mode
CMD ["npm", "start"]
