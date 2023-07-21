import { Document } from 'mongoose';

import { MongooseModel, ICrudService, ICrudOptions } from '@interfaces/factory.interface';
import { Service } from 'typedi';

export const createCrudService = <T extends Document>(model: MongooseModel<T>, options: ICrudOptions): new () => ICrudService<T> => {
  @Service()
  class CRUDService implements ICrudService<T> {
    public model: MongooseModel<T>;
    public options: ICrudOptions = { methods: [] };

    public findAll: (() => Promise<T[]>) | undefined;
    public findById: ((id: string) => Promise<T | null>) | undefined;
    public create: ((entity: T) => Promise<T>) | undefined;
    public update: ((id: string, entity: Partial<T>) => Promise<T | null>) | undefined;
    public delete: ((id: string) => Promise<T | null>) | undefined;

    constructor() {
      this.model = model;
      this.options = options;

      this.findAll = this.options.methods.includes('findAll')
        ? async (): Promise<T[]> => {
            return await this.model.find();
          }
        : undefined;

      this.findById = this.options.methods.includes('findById')
        ? async (id: string): Promise<T | null> => {
            return await this.model.findById(id);
          }
        : undefined;

      this.create = this.options.methods.includes('create')
        ? async (entity: T): Promise<T> => {
            return await this.model.create(entity);
          }
        : undefined;

      this.update = this.options.methods.includes('update')
        ? async (id: string, entity: Partial<T>): Promise<T | null> => {
            return await this.model.findByIdAndUpdate(id, entity, { new: true });
          }
        : undefined;

      this.delete = this.options.methods.includes('delete')
        ? async (id: string): Promise<T | null> => {
            return await this.model.findByIdAndRemove(id);
          }
        : undefined;
    }
  }
  return CRUDService;
};
