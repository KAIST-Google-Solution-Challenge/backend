import { Request, Response, NextFunction } from 'express';
import { bucket, deleteFile } from '../util/multer';
import { format } from 'util';
import { transcribeAudio } from '../util/stt';

export async function uploadAudio(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file attached.' });
    }
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      return res.status(500).send(err.message);
    });

    blobStream.on('finish', () => {
      res.locals.publicUrl = format(`gs://${bucket.name}/${blob.name}`);
      next();
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
}

export async function speechToText(req: Request, res: Response, next: NextFunction) {
  try {
    const transcription = await transcribeAudio(res.locals.publicUrl);
    res.json(transcription);
    next();
  } catch (error) {
    next(error);
  }
}

export async function deleteAudio(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteFile(req.file.originalname);
    next();
  } catch (error) {
    next(error);
  }
}
