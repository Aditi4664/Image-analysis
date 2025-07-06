FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite's default dev server port
EXPOSE 3000

# Start the dev server
CMD ["npm", "start"]
