FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate

ENTRYPOINT ["npm", "start"]