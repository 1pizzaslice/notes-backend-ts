
import { Request, Response , NextFunction } from 'express';
import mongoose from 'mongoose';
import Note from '../models/notesSchema';

interface IUserRequest extends Request {
  user: {
    _id: mongoose.Types.ObjectId;
    isAdmin: boolean;
  };
}

 const handleReadRequest = async (req: IUserRequest, res: Response): Promise<Response> => {
  try {
    const { status, sortBy } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    let query: any = isAdmin ? {} : { createdBy: userId };

    if (status) {
      query.status = status;
    }

    let notesQuery = Note.find(query);

    if (sortBy) {
      const validSortFields = ['created_at', 'updated_at'];

      if (validSortFields.includes(sortBy as string)) {
        const sortOptions = { [sortBy as string]: 1 };
        notesQuery = notesQuery.sort(sortOptions as any);
      } else {
        res.status(400).json({ message: 'Invalid sort field' });
      }
    }

    const results = await notesQuery.exec();
    return res.json(results);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

 const handleReadRequestById = async (req: IUserRequest, res: Response): Promise<Response> => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Note ID format' });
  }

  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.user._id;

    const query = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, createdBy: userId };

    const note = await Note.findOne(query);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json(note);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

 const handleAddRequest = async (req: IUserRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user._id;

    const note = new Note({
      ...req.body,
      createdBy: userId,
    });

    const savedNote = await note.save();
    return res.status(201).json(savedNote);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

 const handleDeleteRequest = async (req: IUserRequest, res: Response): Promise<Response> => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.user._id;

    const query = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, createdBy: userId };

    const note = await Note.findOne(query);

    if (!note) {
      return res.status(404).json({ message: 'Note not found or you do not have permission to delete it' });
    }

    await note.deleteOne();
    return res.json({ message: 'Note deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

 const handleUpdateRequest = async (req: IUserRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.user._id;

    const query = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, createdBy: userId };

    const note = await Note.findOne(query);

    if (!note) {
      res.status(404).json({ message: 'Note not found or you do not have permission to update it' });
      return;
    }

    Object.assign(note, req.body);

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export { 
    handleAddRequest,
    handleReadRequest,
    handleReadRequestById,
    handleUpdateRequest,
    handleDeleteRequest,  
};