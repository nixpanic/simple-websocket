FROM node:21-slim AS base

RUN true \
    && apt-get update \
    && apt-get clean all \
    && true


COPY app /opt/nixpanic/simple-websocket/app
COPY html /opt/nixpanic/simple-websocket/html

WORKDIR /opt/nixpanic/simple-websocket/app

RUN true \
    && npm update \
    && true

EXPOSE "8080/tcp"

ENTRYPOINT [ "npm", "start" ]
