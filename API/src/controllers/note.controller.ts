import { createCrudController } from '@/controllers/factory.controller';
import { createCrudService } from '@/services/factory.service';
import { ICrudOptions } from '@/interfaces/factory.interface';
import { NoteModel, INote, Note } from '@models/notes.model';
import { NextFunction, Request, Response } from 'express';

// Removed create function from options so I can make a custom create function on the NoteController
const noteCrudOptions: ICrudOptions = {
  methods: ['findAll', 'findById', 'update', 'delete'],
};

const NoteService = createCrudService<INote>(NoteModel, noteCrudOptions);
const BaseController = createCrudController<INote>(NoteService);

export class NoteController extends BaseController {
  public createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Insert your custom logic here
      const note: Note = {
        title: req.body.title,
        note: req.body.note,
        date: new Date(), // Here's an example of custom logic - set the date automatically
      };
      const createdNote = await NoteModel.create(note);

      res.status(201).json({ data: createdNote, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
