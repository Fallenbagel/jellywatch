FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir /app

WORKDIR /app

RUN git clone https://github.com/Jpkribs/jellywatch.git

WORKDIR /app/jellywatch

RUN npm install
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000