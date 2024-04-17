FROM node:20.11-slim

# set up the working directory
WORKDIR /app

# copy all the files to the container
COPY ./* /app/

# install the dependencies
RUN npm install -g @nestjs/cli && npm install
RUN npm run build
RUN npm run start:prod