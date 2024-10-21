
import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  note_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  createdBy: mongoose.Types.ObjectId;
}

const noteSchema: Schema = new mongoose.Schema({
  note_id: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId type for unique note IDs
    auto: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

// Pre-save middleware to update 'updated_at' on every update
noteSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Note = mongoose.model<INote>('Note', noteSchema);
export default Note;
