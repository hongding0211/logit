FROM node:16

MAINTAINER keith.dh@hotmail.com

EXPOSE 3000

WORKDIR /home/node/app

COPY ./ /home/node/app

RUN yarn
RUN yarn build

CMD node build/index.js
