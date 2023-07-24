import { createCrudController } from '@/controllers/factory.controller';
import { createCrudService } from '@/services/factory.service';
import { ICrudOptions } from '@/interfaces/factory.interface';
import { NoteModel, INote, Note } from '@models/notes.model';
import { NextFunction, Request, Response } from 'express';
import { NoteService } from '@/services/note.service';
import Container from 'typedi';
// Removed create function from options so I can make a custom create function on the NoteController
const noteCrudOptions: ICrudOptions = {
  methods: ['findAll', 'findById', 'update', 'delete'],
};

const FactoryNoteService = createCrudService<INote>(NoteModel, noteCrudOptions);
const BaseController = createCrudController<INote>(FactoryNoteService);

export class NoteController extends BaseController {
  public noteService = Container.get(NoteService);

  public createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteData: Note = req.body;
      const createdNote = await this.noteService.createNote(noteData);

      res.status(201).json({ data: createdNote, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
