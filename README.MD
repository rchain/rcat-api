# RSong Assets Management API
Asset management middleware powered by https://www.fastify.io/.  

## Install

```
git clone git@github.com:cramick-it/asset-management-ui.git
cd asset-management-api
npm install
cp env.example .env
```

And then fill `.env` file with data. Check subsection `Setup environment vars` for more details.


## Setup environment vars
Open `.env`  file and setup following vars:
- `HTTPS`: true|false
- `PORT` App port
- `NODE_ENV`: development|production
- `MONGODB_URI`: URI to conect to mongodb
- `GMAIL_CLIENT_ID`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `GCS_BUCKET_NAME`
- `GCS_PROJECT_ID`
- `JWT_SECRET`
- `JWT_DURATION_HOURS`
- `SENDGRID_API_KEY`
- `SMS_NOTIFICATIONS_SILENT`
- `EMAIL_NOTIFICATIONS_SILENT`
- `KYC_NOTIFY_EMAIL_FROM_NAME`
- `KYC_NOTIFY_EMAIL_FROM_EMAIL`
- `KYC_NOTIFY_EMAIL_RECIPIENTS`
- `DOCKER_MONGO_DATA_DIR`
- `DROPBOX_ACCESS_TOKEN`
- `DROPBOX_UPLOAD_PATH`
- `TWILLIO_ACCOUNT_SID`
- `TWILLIO_AUTH_TOKEN`
- `TWILLIO_PHONE_NUMBER`
- `SENTRY_DSN`
- `ACQUISITION_API_ENDPOINT_BASE_URL`

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
and you api should be running on port specified in env file with name `PORT`. 
In order to confirm you API is up and running open in the browser `BASE_URL/status` and if all ok you should see following response:
``` 
{
status: "ok"
}
```
`BASE_URL` is variable inside your relevant environment file.

After you started app for the first time you should seed up db. For more details check subsection `Seed mongodb once containers are up`

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

In order to list all running containers execute:
```
docker ps
```

In order to enter into, for example, app container execute:
```
docker-compose exec app bash
```

If you are inside app container you can check logs with following command:
```
pm2 logs
```


#### Seed mongodb once containers are up

In order to seed db first go inside app container:
```
docker-compose exec app bash
```

and then execute:
```
./node_modules/.bin/md-seed run
```

#### Reset docker db

Mongodb will use `DOCKER_MONGO_DATA_DIR` from `env` file for data dir. If you want to reset all database, stop containers and delete dir `DOCKER_MONGO_DATA_DIR`.

## Dependencies
- Acquistion API
- Dropbox for uploading songs: https://www.dropbox.com. `REQUIRE CREDENTIALS/TOKENS`.
- Google Cloud Storage bucket for upload images: https://console.cloud.google.com/storage/browser `REQUIRE CREDENTIALS/TOKENS`.
- Facebook apps: https://developers.facebook.com/apps `REQUIRE CREDENTIALS/TOKENS`.
- Google apps: https://console.developers.google.com/apis/credentials `REQUIRE CREDENTIALS/TOKENS`.
- Twilio for SMS messaging: https://www.twilio.com `REQUIRE CREDENTIALS/TOKENS`. `PAYABLE SERVICE`.
- Sendgrid for transactional emails: https://sendgrid.com `REQUIRE CREDENTIALS/TOKENS`. `PAYABLE SERVICE`.
- Sentry for logging errors: https://sentry.io  `REQUIRE CREDENTIALS/TOKENS`. `PAYABLE SERVICE`. `OPTIONAL`


#### Google Cloud

In order to connect with google cloud need to setup following 2 vars in `.env` file:
- GCS_BUCKET_NAME
- GCS_PROJECT_ID

and also required to donwload google cloud json credentials into root ewith name `env.gcs.json`.
