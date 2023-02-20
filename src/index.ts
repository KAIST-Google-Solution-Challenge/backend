import * as dotenv from 'dotenv';
dotenv.config();
import { Application } from './app/application';
import './app/util/multer';

const application: Application = new Application();
application.startServer();
