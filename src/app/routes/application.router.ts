import { Router } from 'express';
import { recordsRouter } from './records.router';

const router: Router = Router();
router.use('/records', recordsRouter);

export const applicationRouter: Router = router;
