import { AppDataSource } from './../data-source';
import { Request, Response, NextFunction } from 'express';
import { Record } from '../entity';
import { bucket } from '../util/multer';
import { format } from 'util';

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
    record.phoneNumber = req.body.phoneNumber;
    record.probability = req.body.probability;
    record.url = req.body.url;
    const savedRecord = await recordRepository.save(record);
    res.json(savedRecord);
  } catch (error) {
    next(error);
  }
}

export async function updateFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const record = await recordRepository.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });
    record.feedback = req.body.feedback;
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
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      throw err;
    });

    let publicUrl: string;
    blobStream.on('finish', async () => {
      publicUrl = format(`gs://${bucket.name}/${blob.name}`);
      res.json(publicUrl);
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
}
