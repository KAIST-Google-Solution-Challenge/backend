import * as Multer from 'multer';
import { Storage } from '@google-cloud/storage';

const projectId = process.env.GCLOUD_API_KEY;
const storage = new Storage({ projectId });

const fileFilter = function (req, file, cb) {
  console.log(file.mimetype);
  if (file.mimetype !== 'audio/wave' && file.mimetype !== 'audio/mpeg') {
    return cb(new Error('Only WAV and MP3 audios are allowed'));
  }
  cb(null, true);
};

export const imageUploader = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

export const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
