import { INote, Note, NoteModel } from './../models/notes.model';
import { Service } from 'typedi';

@Service()
export class NoteService {
  public async createNote(noteData: Note): Promise<INote> {
    const note = {
      title: noteData.title,
      note: noteData.note,
      date: new Date(), // Here's an example of custom logic - set the date automatically
    };
    const createdNote = await NoteModel.create(note);
    return createdNote;
  }
}
