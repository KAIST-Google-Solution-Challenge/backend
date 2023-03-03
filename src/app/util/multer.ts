import * as Multer from 'multer';
import { Storage } from '@google-cloud/storage';

const projectId = process.env.GCLOUD_API_KEY;
const storage = new Storage({ projectId });

const fileFilter = function (req, file, cb) {
  if (file.mimetype !== 'audio/mpeg' && file.mimetype !== 'audio/wave') {
    return cb(new Error('Only MP3 and WAV audios are allowed'));
  }
  cb(null, true);
};

export const audioUploader = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilter,
});

export const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

export async function deleteFile(fileName: string) {
  await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).file(fileName).delete();
}
