FROM node:14.18.1

WORKDIR /backend

COPY ./package*.json ./

RUN npm install

COPY ./src/ ./

CMD node --watch ./src/app.js