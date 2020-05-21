FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install -g copyfiles pm2 typescript
COPY . .

EXPOSE 8000
EXPOSE 5555
CMD ["sh", "scripts/run.sh"]