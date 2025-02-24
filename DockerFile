# use node as the base image
FROM node:18-alpine

# set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port your Express app runs on
EXPOSE 3000

# Start the application using the compiled JavaScript files
CMD ["node", "dist/server.js"]
