import { Router } from 'express';
import * as RecordController from '../controllers/record.controller';

const router: Router = Router();

router
  .route('/')
  /* List */
  .get(RecordController.get)
  /* Create */
  .post(RecordController.create);

export const recordsRouter: Router = router;
