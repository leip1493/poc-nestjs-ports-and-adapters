# Use the official Node.js image as the base image
FROM node:18.17.0-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
