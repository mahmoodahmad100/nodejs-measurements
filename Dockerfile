FROM node:18.13.0-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["nodemon", "app.js"]