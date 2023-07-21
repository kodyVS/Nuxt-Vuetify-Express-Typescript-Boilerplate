import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { NoteController } from '@/controllers/note.controller';
export class NotesRoute implements Routes {
  public path = '/notes';
  public router = Router();
  public noteController = new NoteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.noteController.getItems);
    this.router.get(`${this.path}/:id`, this.noteController.getItem);
    this.router.post(`${this.path}`, this.noteController.createItem);
    this.router.put(`${this.path}/:id`, this.noteController.updateItem);
    this.router.delete(`${this.path}/:id`, this.noteController.deleteItem);
  }
}
