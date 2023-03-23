## Google-Solution-Challenge Backend

Server is also available at `http://35.216.72.5:3000/` hosting with [`GCE`](https://cloud.google.com/compute?hl=en)

## Prerequisite

### Development Environment

`Node.js` version `16.19`

### Dependencies

You need to download following manually or use `docker`.

[`ffmpeg: 5.0.12`](https://ffmpeg.org/download.html)

`Conversation_model.pt` should be installed from this [link](https://drive.google.com/file/d/1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs/view?usp=share_link) or use below

```sh
wget --load-cookies ~/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies ~/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs" -O src/app/util/classifier/conversation_model.pt && rm -rf ~/cookies.txt
```

if you want to execute mysql in local environment, [`MySQL: 8.0.32`](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/) should be installed for local testing

### .env

To access `Google Cloud Storage Bucket`, 1. Bucket should be created in advance, 2.`.env` should be written with the bucket information.

Please refer this [document](https://cloud.google.com/storage/docs/creating-buckets?hl=en).

```sh
# GCLOUD Config
GCLOUD_STORAGE_BUCKET = {your-bucket-name}
GCLOUD_PROJECT_ID = {your-project-id}
GLOUD_API_KEY = {your-GCLOUD-API-KEY}
```

### service-account-key.json

To access [`Google Speech To Text Api`](https://cloud.google.com/speech-to-text?hl=en), `service-account-key.json` should be created and stored in the root directory of this project. Additionally, it should be save as an environmental variable.

`export GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json`

**note: service account key's filename should be exactly same as `service-account-key.json`**

Please refer this [document](https://cloud.google.com/iam/docs/keys-create-delete?hl=en).

## Run

```sh
npm start
```

### Using Local MySQL Server

Firstly, local mysql info should be saved in .env

```sh
LOCAL_DB_USER = 
LOCAL_DB_PASS = 
```

Run

```sh
mysql.server start
npm run dev:local
```

### Using Google MySQL Server

Firstly, MySQL server info should be saved in .env

```sh
DB_HOST = 
DB_USER = 
DB_PASS = 
```

Run

```sh
npm run dev:cloud
```
