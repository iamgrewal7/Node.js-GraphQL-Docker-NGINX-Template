#!/bin/bash

npm i
npx prisma generate
npx prisma migrate up --experimental
npm run dev