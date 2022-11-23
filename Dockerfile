FROM node:18.10-alpine3.15
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 4000
CMD node server.js