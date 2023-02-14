import * as dotenv from 'dotenv';
dotenv.config();
import { Application } from './app/application';

const application: Application = new Application();
application.startServer();
