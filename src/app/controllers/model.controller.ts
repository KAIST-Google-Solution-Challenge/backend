import { Request, Response, NextFunction } from 'express';
import { bucket, deleteFile, uploadFileToBucket } from '../util/multer';
import { format } from 'util';
import { transcribeMp3, transcribeWav } from '../util/stt';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { Message, MessageResponse } from '../models/message';
import logger from '../util/logger';

export async function convertAudio(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file attached.' });
    }

    res.locals.filename = req.file.filename + '.wav';
    res.locals.filepath = './uploads/results/' + res.locals.filename;

    logger.debug('Start converting...');
    if (req.file.mimetype !== 'audio/wave') {
      ffmpeg(req.file.path)
        .inputFormat('m4a')
        .outputFormat('wav')
        .audioBitrate('44.1k')
        .setStartTime(0)
        .setDuration(59)
        .on('progress', function (progress) {
          console.log(progress);
        })
        .on('error', (err) => {
          next(err);
        })
        .on('end', () => {
          // Delete the original audio file
          logger.debug('End converting...');
          fs.unlinkSync(req.file.path);
          next();
        })
        .save(res.locals.filepath);
    } else {
      fs.copyFileSync(req.file.path, './uploads/results/' + req.file.filename);
      fs.unlinkSync(req.file.path);
      next();
    }
  } catch (error) {
    next(error);
  }
}

export async function uploadAudio(req: Request, res: Response, next: NextFunction) {
  try {
    res.locals.publicUrl = format(`gs://${bucket.name}/${res.locals.filename}`);
    await uploadFileToBucket(res.locals.filepath);
    next();
  } catch (error) {
    next(error);
  }
}

export async function speechToText(req: Request, res: Response, next: NextFunction) {
  try {
    logger.debug('Start STT...');
    const transcription = await transcribeWav(res.locals.publicUrl);
    res.locals.transcription = transcription;
    logger.debug('End STT...');
    next();
  } catch (error) {
    next(error);
  }
}

export async function classify(req: Request, res: Response, next: NextFunction) {
  try {
    if (res.locals.transcription === undefined) {
      next();
    }
    logger.debug('Start Classify...');
    const inference = spawn('python3.9', ['model/main.py', res.locals.transcription]);

    let inferenceResult: string;
    inference.stdout.on('data', (data) => {
      const results = data.toString().split('\n');
      inferenceResult = results[results.length - 2];
      logger.debug(`classify results: ${inferenceResult}`);
    });

    inference.stderr.on('data', async (data) => {
      logger.debug(data);
      fs.unlinkSync(res.locals.filepath);
      await deleteFile(res.locals.filename);
      throw new Error('Classifying failed');
    });

    inference.on('close', (code) => {
      logger.debug('End Classify...');
      res.json(inferenceResult);
      next();
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAudio(req: Request, res: Response, next: NextFunction) {
  try {
    // Delete original audio file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Delete converted audio file
    if (fs.existsSync(res.locals.filepath)) {
      fs.unlinkSync(res.locals.filepath);
    }

    // Delete audio file from bucket
    await deleteFile(res.locals.filename);
  } catch (error) {
    next(error);
  }
}

export async function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  // Delete original audio file
  if (fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  // Delete converted audio file
  if (fs.existsSync(res.locals.filepath)) {
    fs.unlinkSync(res.locals.filepath);
  }

  // Delete audio file from bucket
  await deleteFile(res.locals.filename);

  console.log(error.stack);
  res.status(500).send(error.message);
}

export async function analyzeMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const messages: Message[] = req.body.messages;
    const results: MessageResponse[] = [];

    if (messages.length == 0) {
      return res.sendStatus(200);
    }

    const analyzeMesage = function (content: string): Promise<string> {
      const inference = spawn('python3.9', ['model/main.py', content]);
      let prob: string;

      inference.stdout.on('data', function (data: string) {
        const stdout = data.toString().split('\n');
        prob = stdout[stdout.length - 2];
      });

      return new Promise((resolve, reject) => {
        inference.stderr.on('data', function (data: string) {
          reject(new Error('Error classifying data'));
        });

        inference.on('close', (code) => {
          console.log(prob);
          resolve(prob);
        });
      });
    };

    const analyzeWrapper = function (message: Message): Promise<string> {
      const content = message.content;
      return analyzeMesage(content);
    };

    for (var i = 0; i < messages.length; i++) {
      const message = messages[i];
      const result = await analyzeWrapper(message);
      results.push({
        id: message.id,
        probability: Number(result),
      });
    }

    await Promise.all(results);
    res.json(results);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
}
