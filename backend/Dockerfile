# Dockerfile for backend

FROM node:16.13.1
WORKDIR /canteenBackend

COPY package.json .
COPY package-lock.json .

RUN npm i && npm i -g nodemon
COPY . .
EXPOSE 5000
CMD nodemon server