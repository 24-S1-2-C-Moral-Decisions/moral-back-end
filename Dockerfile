FROM node:20.11-slim

# Create app directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Install app dependencies
RUN npm run build

# set environment variables
ARG BACKEND_PORT=3001
ENV BACKEND_PORT=${BACKEND_PORT}

VOLUME /app/.env

# Expose port and start application
EXPOSE $BACKEND_PORT
CMD ["npm", "start"]