# Overview

The project is build using docker, with different configuration for development and production and environment. Language used is TypeScipt (config and lint file is include). I am using `GraphQL-yoga` which is build on top of `Apollo`, `Express` server. `Redis` is used along with `express-session` for maintain session. Project also consist of `winston logger` which logs all the errors to error.log file and `Sentry` library if you wish to track errors on sentry
For persistance, I use `MySQL` along with `Prisma ORM` which can automatically apply migrations and has nice Django-Admin like UI for adding and dropping data.

# How to get started

> Development

1. Install Docker Cli and Docker Compose
2. Clone the repo and create a `.env` file with following info
   - SECRET_KEY(Used by Redis)
   - NODE_ENV
   - HOST
   - PORT
   - SESSION_NAME
3. `docker-compose -f "docker-compose.dev.yml" -f "docker-compose.yml" up -d --build`
4. This will build images for Node, MySQL, Redis and Express Server and will run those images in seperate containers.
5. Open shell for MySQL container using `docker exec -it {continer_id or name} /bin/sh -c "[ -e /bin/bash ] && /bin/bash || /bin/sh"` and create database.
6. `"docker-compose.dev.yml"` run the express server using `nodemon` and mounts the local volume, therfore any edit made in project folder, will trigger `nodemon` to rebuild the server and therefore enabling development while in docker.

> Production

1. For deploying the project use `docker-compose.prod.yml` file instead of `"docker-compose.dev.yml"`. It creates and run image of NGINX(used as reverse proxy) and Certbot(used for ssl certificate for domains)
2. You will still need to create databse inside docker, when running this for first time.

**WIP**
