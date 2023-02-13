import { AppDataSource } from './../data-source';
import { Request, Response, NextFunction } from 'express';
import { Record } from '../entity';

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const savedRecords = await AppDataSource.manager.find(Record);
    res.json(savedRecords);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const savedRecord = await AppDataSource.manager.save(req.body);
    res.json(savedRecord);
  } catch (error) {
    next(error);
  }
}
