import { Router } from 'express';
import * as RecordController from '../controllers/record.controller';
import { imageUploader } from '../util/multer';

const router: Router = Router();

router
  .route('/')
  /* List */
  .get(RecordController.get)
  /* Create */
  .post(RecordController.create);

router.route('/upload/:id').post(imageUploader.single('file'), RecordController.uploadAudio);

router.route('/transcript').post(RecordController.speechToText);

export const recordsRouter: Router = router;
