import * as Multer from 'multer';
import { Storage } from '@google-cloud/storage';
import multer = require('multer');

const projectId = process.env.GCLOUD_API_KEY;
const storage = new Storage({ projectId });

const fileFilter = function (req, file, cb) {
  if (file.mimetype !== 'audio/mpeg' && file.mimetype !== 'audio/wave' && file.mimetype !== 'audio/mp4') {
    return cb(new Error('Only MP3, WAV and M4A audios are allowed'));
  }
  cb(null, true);
};

const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/originals');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

export const audioUploader = multer({
  storage: localStorage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilter,
});

// export const audioUploader = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 1024 * 1024 * 50,
//   },
//   fileFilter: fileFilter,
// });

export const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

export async function uploadFileToBucket(filepath: string) {
  await bucket.upload(filepath);
}

export async function deleteFile(fileName: string) {
  await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).file(fileName).delete();
}
