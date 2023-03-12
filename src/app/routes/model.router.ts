import { Router } from 'express';
import * as ModelController from '../controllers/model.controller';
import { audioUploader } from '../util/multer';

const router: Router = Router();

router.post(
  '/',
  audioUploader.single('file'),
  ModelController.convertAudio,
  ModelController.uploadAudio,
  ModelController.speechToText,
  ModelController.classify,
  ModelController.deleteAudio
);

router.post('/messages', ModelController.analyzeMessages);

export const modelRouter: Router = router;
