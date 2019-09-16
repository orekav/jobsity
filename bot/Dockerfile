FROM node:12-alpine

ENV workdir /usr/src/app/

RUN mkdir --parents $workdir
WORKDIR $workdir
COPY package.json $workdir
COPY package-lock.json  $workdir

RUN npm install
COPY . $workdir

USER 1001