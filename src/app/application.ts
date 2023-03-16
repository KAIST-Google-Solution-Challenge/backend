import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Express, NextFunction, Request, Response } from 'express';
import logger from './util/logger';
import { applicationRouter } from './routes';
import { AppDataSource } from './data-source';

export class Application {
  private _server: Express;

  constructor() {
    this._server = express();
    this._server.set('host', process.env.HOST || 'localhost');
    this._server.set('port', process.env.PORT || 3000);
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({ extended: true }));
    this._server.use(cors());
    this._server.use(this.logRequest);
    if (process.env.NODE_ENV === 'cloud' || process.env.NODE_ENV === 'local') {
      AppDataSource.initialize()
        .then(() => {
          logger.info('Database connected');
        })
        .catch((error) => {
          logger.error('Database connection error');
        });
    }
    this._server.use(applicationRouter);
  }

  private logRequest(req: Request, res: Response, next: NextFunction) {
    logger.info(`Request URL: ${req.originalUrl} Method: ${req.method}`);
    next();
  }

  public startServer(): void {
    const host: string = this._server.get('host');
    const port: number = this._server.get('port');
    this._server.listen(port, () => {
      logger.info(`Server started at http://${host}:${port}`);
    });
  }
}
