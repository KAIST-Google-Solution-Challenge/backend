import { Router } from 'express';
import * as RecordController from '../controllers/record.controller';
import { audioUploader } from '../util/multer';

const router: Router = Router();

router
  .route('/')
  /* List */
  .get(RecordController.get)
  /* Create */
  .post(RecordController.create);

router.route('/:id').patch(RecordController.updateFeedback);

router.post('/upload', audioUploader.single('file'), RecordController.uploadAudio);

export const recordsRouter: Router = router;
