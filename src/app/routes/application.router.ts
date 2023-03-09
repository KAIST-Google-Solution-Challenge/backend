import { Router } from 'express';
import { recordsRouter } from './records.router';
import { modelRouter } from './model.router';

const router: Router = Router();
router.use('/records', recordsRouter);
router.use('/model', modelRouter);

export const applicationRouter: Router = router;
