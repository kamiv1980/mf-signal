FROM node:22-alpine
LABEL authors="kameniev"

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json
COPY package*.json ./

# Install dependencies (production only, for smaller size)
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the index file
CMD ["node", "index.js"]
