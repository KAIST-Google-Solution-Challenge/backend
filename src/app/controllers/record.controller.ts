import { AppDataSource } from './../data-source';
import { Request, Response, NextFunction } from 'express';
import { Record } from '../entity';
import { bucket } from '../util/multer';
import { format } from 'util';
import { v4 as uuidv4 } from 'uuid';

const recordRepository = AppDataSource.getRepository(Record);

export async function checkDevEnv(req: Request, res: Response, next: NextFunction) {
  try {
    if (process.env.NODE_ENV !== 'cloud' && process.env.NODE_ENV !== 'local') {
      return res.status(400).send('Invalid environment');
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const savedRecords = await recordRepository.find();
    res.json(savedRecords);
  } catch (error) {
    next(error);
  }
}

export async function getByPhoneNumber(req: Request, res: Response, next: NextFunction) {
  try {
    const records = await recordRepository.find({
      where: {
        phoneNumber: req.params.phoneNumber,
      },
      select: {
        id: true,
        createdAt: true,
        probability: true,
      },
    });
    res.json(records);
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
    const blob = bucket.file(uuidv4());
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
