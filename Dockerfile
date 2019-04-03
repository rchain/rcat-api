FROM node:8.15

RUN npm install -g pm2

WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
CMD pm2 start --no-daemon ./bin/www
