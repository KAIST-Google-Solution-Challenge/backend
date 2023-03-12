## Google-Solution-Challenge Backend

## Prerequisite

`ffmpeg` should be installed in the server environment

`MySQL 8.0.32` should be installed for local testing

`Conversation_model.pt` should be installed from this [link](https://drive.google.com/file/d/1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs/view?usp=share_link)

### .env
```sh
# GCLOUD MySQL
DB_HOST = 
DB_USER = 
DB_PASS = 

# Local MySQL
LOCAL_DB_USER = 
LOCAL_DB_PASS = 

# GCLOUD Config
GCLOUD_STORAGE_BUCKET = {your-bucket-name}
GCLOUD_PROJECT_ID = {your-project-id}
GLOUD_API_KEY = {your-GCLOUD-API-KEY}
```

## Run

```sh
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/solution-challenge-kaist-947caf3ed982.json"

# With GCLOUD MySQL
npm start

# With Local Environment
mysql.server start
npm run dev:local
```
