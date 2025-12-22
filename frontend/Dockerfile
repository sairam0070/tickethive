# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the React app
RUN npm run build

# Install serve globally to serve the build
RUN npm install -g serve

EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
