# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN command npm install -g pnpm@latest-10

# Install the application dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .


# ENV NODE_ENV=production

# ENV ENV_FILE_PATH=.env.production

# Build the NestJS application
RUN pnpm build

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["pnpm", "start:prod"]