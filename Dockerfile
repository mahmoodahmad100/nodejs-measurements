FROM node:18.13.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 80

CMD ["nodemon", "app.js"]