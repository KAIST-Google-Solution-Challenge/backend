import { Request, Response, NextFunction } from 'express';
import { bucket, deleteFile, uploadFileToBucket } from '../util/multer';
import { format } from 'util';
import { transcribeMp3, transcribeWav } from '../util/stt';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

export async function convertAudio(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file attached.' });
    }
    if (req.file.mimetype === 'audio/mp4' || req.file.mimetype === 'application/octet-stream') {
      res.locals.filepath = './uploads/results/' + req.file.filename + '.wav';
      res.locals.filename = req.file.filename + '.wav';
      ffmpeg(req.file.path)
        .inputFormat('m4a')
        .outputFormat('wav')
        .audioBitrate('44.1k')
        .on('progress', function (progress) {
          console.log(progress);
        })
        .on('error', (err) => {
          throw new Error(err);
        })
        .on('end', () => {
          fs.unlinkSync(req.file.path);
          next();
        })
        .save(res.locals.filepath);
    } else {
      res.locals.filepath = './uploads/results/' + req.file.filename + '.mp3';
      res.locals.filename = req.file.filename + '.mp3';
      fs.copyFileSync(req.file.path, './uploads/results/' + req.file.filename);
      fs.unlinkSync(req.file.path);
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Error converting audio file' });
  }
}

export async function uploadAudio(req: Request, res: Response, next: NextFunction) {
  try {
    res.locals.publicUrl = format(`gs://${bucket.name}/${res.locals.filename}`);
    await uploadFileToBucket(res.locals.filepath);
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error uploading audio file' });
  }
}

export async function speechToText(req: Request, res: Response, next: NextFunction) {
  try {
    let transcription: string;
    if (req.file.mimetype === 'audio/mpeg') {
      transcription = await transcribeMp3(res.locals.publicUrl);
    } else {
      transcription = await transcribeWav(res.locals.publicUrl);
    }
    res.locals.transcription = transcription;
    // res.json(transcription);
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error transcribing audio file', error: error });
    next();
  }
}

export async function classify(req: Request, res: Response, next: NextFunction) {
  try {
    if (res.locals.transcription === undefined) {
      next();
    }

    const inference = spawn('python', [__dirname + '/../util/classifier/main.py', res.locals.transcription]);

    let inferenceResult: string;
    inference.stdout.on('data', (data) => {
      const results = data.toString().split('\n');
      inferenceResult = results[results.length - 2];
      console.log(inferenceResult);
    });

    inference.stderr.on('data', (data) => {
      res.status(500).json({ message: 'Error classifying script', error: data.toString() });
      next();
    });

    inference.on('close', (code) => {
      res.json(inferenceResult);
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error classifying script', error: error });
    next();
  }
}

export async function deleteAudio(req: Request, res: Response, next: NextFunction) {
  try {
    fs.unlinkSync(res.locals.filepath);
    await deleteFile(res.locals.filename);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting audio file' });
  }
}
