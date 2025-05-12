#! /bin/bash

# check if the environment file exists
if [ ! -f ./.env ]; then
  echo "Environment file not found. Exiting."
  exit 1
fi

# copy the environment file to the backend directory
cp ./.env backend/migration.env

cd backend/

# create a docker image to do it (node:20.11-slim)
docker build -t migration_run -f Dockerfile.migration.run .

# run the migration
docker run migration_run

# remove container
docker ps -a | grep migration_run | awk '{print $1}' | xargs docker rm

# remove the docker image
docker rmi migration_run

cd -
