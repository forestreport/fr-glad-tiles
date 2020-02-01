FROM node:12

ENV DEBIAN_FRONTEND=noninteractive NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm config set '@bit:registry' https://node.bitsrc.io && \
    npm install --production
COPY . .

VOLUME ["/app/logs"]
EXPOSE 4011
CMD ["node", "server.js"]