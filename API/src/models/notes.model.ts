import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  note: string;
  date: Date;
}
export interface Note {
  title: string;
  note: string;
  date: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  note: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const NoteModel = model<INote & Document>('Note', NoteSchema);
