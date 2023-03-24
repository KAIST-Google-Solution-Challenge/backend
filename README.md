## Google-Solution-Challenge Backend

Server is also available at `http://35.216.72.5:3000/` hosting with [`GCE`](https://cloud.google.com/compute?hl=en)

## Run

There are two ways to run `backend` in your local environment. We highly recommend you to choose first option with `Docker`

1. using `Docker`
2. Manually install all dependencies and requirements

`backend` is written by `"typescript": "4.5.2"` and `"Node.js": "16.19"`

### Prerequisite

1. Creating `.env`

  To access `Google Cloud Storage Bucket`, 1. Bucket should be created in advance, 2.`.env` should be written with the bucket information.

  Please refer this [document](https://cloud.google.com/storage/docs/creating-buckets?hl=en).
  
  ```sh
  # .env
  GCLOUD_STORAGE_BUCKET = {your-bucket-name}
  GCLOUD_PROJECT_ID = {your-project-id}
  GLOUD_API_KEY = {your-GCLOUD-API-KEY}
  ```
2. service-account-key

  To access [`Google Speech To Text Api`](https://cloud.google.com/speech-to-text?hl=en), `service-account-key.json` should be created and stored in the root directory of this project. Additionally, it should be save as an environmental variable.

  **note: service account key's filename should be exactly same as `service-account-key.json`**

  ```sh
  export GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json
  ```

  Please refer this [document](https://cloud.google.com/iam/docs/keys-create-delete?hl=en).

### Docker

```sh
docker build . -t myimage
docker run -it myimage
npm start
```

### Manual Installation

There are several requirements on `backend`.

[`ffmpeg: 5.0.12`](https://ffmpeg.org/download.html)

```sh
./setup
```

Optional : [`MySQL: 8.0.32`](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/) (for local DB testing)

## APIs

### `{{path}}/model/`

POST with form-data, named `file`. Only `MP3`, `WAV` and `M4A` are available.

returns the probability that the recording is likely to be voice phishing

Audio file and its script are not remained in the server.

<br />

### `{{path}}/model/messages`

Post, 

```
{
    "messages": [
        {
            "id": 1,
            "content": "."
        },
        {
            "id": 2,
            "content": ""
        },
        ...
    ]
}
```

returns the probability that each message is likely to be voice phishing.

Messages are not remained in the server.




