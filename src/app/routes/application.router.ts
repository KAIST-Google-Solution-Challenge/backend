import { Router } from 'express';
import { modelRouter } from './model.router';

const router: Router = Router();
router.use('/model', modelRouter);

export const applicationRouter: Router = router;
