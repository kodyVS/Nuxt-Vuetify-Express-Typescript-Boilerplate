import { Document, Model } from 'mongoose';
export type MongooseModel<T extends Document> = Model<T>;

export type CrudMethods = 'findAll' | 'findById' | 'create' | 'update' | 'delete';

export interface ICrudService<T extends Document> {
  findAll?: () => Promise<T[]>;
  findById?: (id: string) => Promise<T | null>;
  create?: (entity: T) => Promise<T>;
  update?: (id: string, entity: T) => Promise<T | null>;
  delete?: (id: string) => Promise<T | null>;
}

export interface ICrudOptions {
  methods: CrudMethods[];
}
