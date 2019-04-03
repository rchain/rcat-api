# RSong Assets Management API
Asset management middleware powered by https://www.fastify.io/.  

## Install

```
git clone git@github.com:cramick-it/asset-management-ui.git
cd asset-management-api
npm install
cp env.example .env
```

And then fill `.env` file with data.

## Run

On MacOS or Linux, run the app with this command:
```
DEBUG=myapp:* npm start
```

On Windows, use this command:
```
set DEBUG=myapp:* & npm start
```

## Docker

In order to run the application and mongodb using docker-compose first create the .env file as described before and then run following commans.

```
docker-compose build
docker-compose up

```

In order to just build the application image run the following command:

```
docker build -t asset-management-api-express:latest .
```

In order to run this image execute:
```
docker run asset-management-api-express:latest
```


## Usefull links
- http://joliv.me/b/2016/10/15/express-api-swagger/
- http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
