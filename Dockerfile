# Use an official Node.js runtime as a base image
FROM node:20.10.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build TypeScript source
RUN npm run build

# Expose the port your app will run on
EXPOSE 3030

# Run tests and start the application
CMD ["npm", "run test && npm run dev"]