import { Router } from 'express';
import * as SttController from '../controllers/stt.controller';
import { audioUploader } from '../util/multer';

const router: Router = Router();

router.post('/', audioUploader.single('file'), SttController.uploadAudio, SttController.speechToText, SttController.deleteAudio);

export const sttRouter: Router = router;
