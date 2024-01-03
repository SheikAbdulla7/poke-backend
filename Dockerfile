FROM node:20.10-slim

WORKDIR /app

RUN npm install -g nodemon

COPY . .

RUN npm install

CMD [ "nodemon", "index.js" ]