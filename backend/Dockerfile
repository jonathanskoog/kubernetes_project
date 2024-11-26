FROM node:23-alpine
EXPOSE 3001
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ["npm", "run", "start"]