# Getting Started

## Database
Our configuration of database is in `./env/.database.env` file. It will not be set up in this repository. 
You can create your own database and set up the configuration in the file.

example of `.database.env` file:
```env
DATABASE_CONN_STRING=mongodb://127.0.0.1:27017/testdb
```

## In Docker

1. First, install [docker](https://docs.docker.com/get-docker/)

2. build and run docker container

```bash
docker build --build-arg BACKEND_PORT=3001 -t backend .
docker run -d -p 3001:3001 -v ./.env/:/app/.env backend
```
## In Local

### Installation

```bash
$ npm install
$ npm install @nestjs/cli -g
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

### For Windows (Optional)

1. If you cannot start normally (usually see "NODE_OPTIONS is not recognized as an internal or external command"), please install cross-env:

```bash
$ npm install --save-dev cross-env
```
2. Then update `package.json`, modify `start` script to make it compatible with Windows system:

```package.json
  "scripts": {
    "start": "cross-env NODE_OPTIONS='--max-old-space-size=5120' nest start",
    "start:dev": "cross-env NODE_OPTIONS='--max-old-space-size=5120' NODE_ENV=development nest start --watch",
    "start:debug": "cross-env NODE_OPTIONS='--max-old-space-size=5120' NODE_ENV=development nest start --debug --watch",
    "start:prod": "cross-env node --max-old-space-size=5120 --expose-gc dist/src/main",
  },
```

3. Run the app:

```bash
$ npm run start
```

### Create new controller

```bash
$ nest g controller controller/<controller-name>
```

### Create new module

```bash
$ nest g module module/<module-name>
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