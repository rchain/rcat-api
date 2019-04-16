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

## Run from source

On MacOS or Linux, run the app with this command:
```
DEBUG=myapp:* npm start
```

On Windows, use this command:
```
set DEBUG=myapp:* & npm start
```

## Seeding database

Run the following command to seed database:
```
./node_modules/.bin/md-seed run
```
Add `-d` optionally to drop database before seeding.

## Google Cloud

In order to connect with google cloud need to setup following 2 vars in `.env` file:
- GCS_BUCKET_NAME
- GCS_PROJECT_ID

and also required to donwload google cloud json credentials into root ewith name `env.gcs.json`.

## Docker 
In order to run the application and mongodb using docker-compose first create the .env file. Be sure to change the .env to point to dockerized mongo instance by setting:

```
MONGODB_URI=mongodb://mongo:27017/asset-management-api
```

After that run following commands:

```
docker-compose build
docker-compose up
```

In order to just build the application image run the following command:

```
docker build -t asset-management-api:latest .
```

In order to run this image execute:
```
docker run asset-management-api:latest
```

In order to stop all containers execute:
```
docker-compose stop
```

In order to stop and remove all containers execute:
```
docker-compose down
```

## Usefull links
- https://console.developers.google.com
- https://myaccount.google.com/permissions?pli=1
- https://developers.facebook.com/apps
- https://framp.me/joi-tester/
- http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
- https://medium.com/@rocksinghajay/login-with-facebook-and-google-in-reactjs-990d818d5dab
- https://medium.com/@iwozzy/easily-host-images-with-node-and-google-cloud-storage-29fb14e2cdb8
