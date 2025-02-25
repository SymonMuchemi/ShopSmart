# use node as the base image
FROM node:20-alpine AS builder

# set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install ci

# Copy the rest of the application
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# production stage
FROM node:20-alpine

WORKDIR /app

# copy the built aoo from the builder stage
COPY --from=builder /app/dist /app/dist
COPY package*.json ./

# install only production dependencies
RUN npm install --only=production

# Expose the port your Express app runs on
EXPOSE 3000

# Start the application using the compiled JavaScript files
CMD ["node", "dist/server.js"]
