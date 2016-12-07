FROM mhart/alpine-node:7
# FROM node:latest
MAINTAINER Rhio Kim <rhio.kim@gmail.com>

# RUN apk add --no-cache git openssh

# Copy package first to cache npm-install and speed up build
RUN mkdir -p server
WORKDIR server

COPY lib lib
COPY index.js index.js
COPY package.json package.json

RUN npm install --quiet --no-color --prod
RUN npm cache clean

ENV PORT 8082

EXPOSE $PORT

CMD ["npm", "start"]
