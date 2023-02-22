import { Router } from 'express';
import { recordsRouter } from './records.router';
import { sttRouter } from './stt.router';

const router: Router = Router();
router.use('/records', recordsRouter);
router.use('/stt', sttRouter);

export const applicationRouter: Router = router;
