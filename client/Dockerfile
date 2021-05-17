FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a
ENV NODE_ENV production
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --only=production

COPY --chown=node:node . /usr/src/app

EXPOSE 3000

USER react-app

CMD ["npm", "start"]