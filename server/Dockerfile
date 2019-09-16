FROM node:12-alpine

ENV workdir /usr/src/app/

RUN mkdir --parents $workdir
WORKDIR $workdir
COPY package.json $workdir
COPY package-lock.json  $workdir

RUN npm install
COPY . $workdir

RUN npm run build
# RUN npm prune --production

USER 1001