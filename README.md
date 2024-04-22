# Nest.js API

This is a Nest.js REST API project.

## Features

- [Dockerized local development](#dockerized-local-development)
- [Configuration via ENV variables](#configuration-via-env-variables)
- [Validation via DTO](#validation-via-dto)
- [DB dynamic switching](#db-dynamic-switching)
- [Redis cache](#redis-cache)
- [JWT auth with passport.js](#jwt-auth-with-passportjs)
- [Logger with TraceID generation](#logger-with-trace-id-generation)
- [Automatic APIs documentation with Swagger](#automatic-apis-documentation-with-swagger)

### Dockerized local development

Check out [.docker-node-api](./.docker-node-api) folder and [installation guide](#installation) for more details.

### Validation via DTO

Requests to APIs are validated via [DTOs](./api/src/user/dto).

### DB dynamic switching

There are 3 databases:

```
db0 - master database that stores userId and db name
db1 - users database 1
db2 - users database 2
```

Based on the db name in the JWT token, requests are directed to their respective databases.

### Redis cache

API response is cached using cache interceptor.

### JWT auth with passport.js

JWT authentication is configured and authentication is done using JWT token.

### Logger with Trace ID generation

[Pino](https://github.com/pinojs/pino) added as application logger.

Each request to API is signed with unique TraceID and passed to logger through AsyncLocalStorage.

### Automatic APIs documentation with Swagger

API docs are available at [http://localhost:3000/api](http://localhost:3000/api)

## Installation

### Prerequisites

- Docker for Desktop
- Node.js LTS

### Getting started

- Clone the repository

```console
git clone https://github.com/raja03/nestjs-api.git
```

- Run docker containers (DBs and Redis)

```console
cd nestjs-api/.docker-node-api
chmod +x ./init-multi-postgres-databases.sh
docker-compose up -d
```

- Go to api folder and copy env file

```console
cd ../api
cp .env.example .env
```

- Next install dependencies

```console
npm ci
```

- Run migrations for the 3 databases used

```console
npm run migrations:db0:up
npm run migrations:db1:up
npm run migrations:db2:up
```

- Run application

```console
npm start
```

## Workflow

### Register
Use http://localhost:3000/users/register to create an user

### Login
Use http://localhost:3000/users/login to login as the created user

### Authentication
Pass JWT token in the Authorization header to access protected routes






