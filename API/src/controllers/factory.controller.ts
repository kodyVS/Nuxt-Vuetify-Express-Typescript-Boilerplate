import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { ICrudService } from '@/interfaces/factory.interface';

export const createCrudController = <T extends Document>(ServiceClass: new () => ICrudService<T>) => {
  class CRUDController {
    public service = Container.get(ServiceClass);

    public getItems = this.service.findAll
      ? async (req: Request, res: Response, next: NextFunction) => {
          try {
            const items: T[] = await this.service.findAll();

            res.status(200).json({ data: items, message: 'findAll' });
          } catch (error) {
            next(error);
          }
        }
      : (req: Request, res: Response, next: NextFunction) => {
          res.status(405).json({ error: 'Method not allowed' });
        };

    public getItem = this.service.findById
      ? async (req: Request, res: Response, next: NextFunction) => {
          try {
            const entity: T | null = await this.service.findById(req.params.id);

            res.status(200).json({ data: entity, message: 'findById' });
          } catch (error) {
            next(error);
          }
        }
      : (req: Request, res: Response, next: NextFunction) => {
          res.status(405).json({ error: 'Method not allowed' });
        };

    public createItem = this.service.create
      ? async (req: Request, res: Response, next: NextFunction) => {
          try {
            const createdItem: T = await this.service.create(req.body);

            res.status(201).json({ data: createdItem, message: 'create' });
          } catch (error) {
            next(error);
          }
        }
      : (req: Request, res: Response, next: NextFunction) => {
          res.status(405).json({ error: 'Method not allowed' });
        };

    public updateItem = this.service.update
      ? async (req: Request, res: Response, next: NextFunction) => {
          try {
            const updatedItem: T | null = await this.service.update(req.params.id, req.body);

            res.status(200).json({ data: updatedItem, message: 'update' });
          } catch (error) {
            next(error);
          }
        }
      : (req: Request, res: Response, next: NextFunction) => {
          res.status(405).json({ error: 'Method not allowed' });
        };

    public deleteItem = this.service.delete
      ? async (req: Request, res: Response, next: NextFunction) => {
          try {
            const deletedItem: T | null = await this.service.delete(req.params.id);

            res.status(200).json({ data: deletedItem, message: 'delete' });
          } catch (error) {
            next(error);
          }
        }
      : (req: Request, res: Response, next: NextFunction) => {
          res.status(405).json({ error: 'Method not allowed' });
        };
  }

  return CRUDController;
};
