## Google-Solution-Challenge Backend

## Prerequisite

`ffmpeg` should be installed in the server environment

## Run

```sh
npm run setup
npm start
```

## Local Test

### Prerequisite

- local mysql server

if you test with android simulator, you should set the address `'10.0.2.2'` rather than `'localhost'`

```sh
mysql.server start
npm run setup
npm run dev:local
```
