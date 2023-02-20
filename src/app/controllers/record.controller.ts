import { AppDataSource } from './../data-source';
import { Request, Response, NextFunction } from 'express';
import { Record } from '../entity';
import { bucket } from '../util/multer';
import { format } from 'util';
import { transcribeAudio } from '../util/stt';

const recordRepository = AppDataSource.getRepository(Record);

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const savedRecords = await recordRepository.find();
    res.json(savedRecords);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const record = new Record();
    record.deviceId = req.body.deviceId;
    record.isHandled = req.body.isHandled;
    const savedRecord = await recordRepository.save(record);
    res.json(savedRecord);
  } catch (error) {
    next(error);
  }
}

export async function uploadAudio(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    const recordId = req.params.id;
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      throw err;
    });

    let publicUrl: string;
    blobStream.on('finish', async () => {
      publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
      await recordRepository.update(recordId, {
        url: publicUrl,
      });
      res.json(publicUrl);
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
}

export async function speechToText(req: Request, res: Response, next: NextFunction) {
  try {
    const transcription = await transcribeAudio(req.body.url);
    res.json(transcription);
  } catch (error) {
    next(error);
  }
}
