#!/bin/sh

npx prisma generate
npx prisma migrate up --experimental
npm run build
cd src
copyfiles */*.graphql ../dist
cd ..
pm2-runtime dist/index.js