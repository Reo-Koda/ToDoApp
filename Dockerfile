FROM node:16-alpine

WORKDIR /app

COPY todo-app/package*.json ./

RUN npm install

COPY todo-app/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]