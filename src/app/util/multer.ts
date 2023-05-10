import { Storage } from '@google-cloud/storage';
import multer = require('multer');

const projectId = process.env.GCLOUD_API_KEY;
const storage = new Storage({ projectId });

export const availableTypes = ['audio/wave', 'audio/mp4', 'application/octet-stream'];

const fileFilter = function (req, file, cb) {
  if (!availableTypes.includes(file.mimetype)) {
    return cb(new Error(`${file.mimetype} type is not allowed`));
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
  const file = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).file(fileName);
  try {
    await file.delete();
  } catch (error) {}
}
