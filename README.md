# Getting Started

## In Docker

1. First, install [docker](https://docs.docker.com/get-docker/)

2. run docker container

```bash
cd backend
# macOS
docker run -it --rm -v './':/backend -w /backend -p 5001:5001 node:20.11-slim /bin/bash
# windows
docker run -it --rm -v "path/to/backend/dir":/backend -w /backend -p 5001:5001 node:20.11-slim /bin/bash
# inside docker container
# install dependencies (only need to run once)
npm install
# run server
npm run start:dev
```
## In Local

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```