# Dockerfile for frontend

FROM node:16.13.1
WORKDIR /canteenFrontend

COPY package.json .
COPY package-lock.json .

RUN npm i
COPY . .
EXPOSE 3000
CMD npm start