

import express from 'express';
import { handleAddRequest, handleReadRequest, handleReadRequestById, handleUpdateRequest, handleDeleteRequest } from '../controllers/working';

const router = express.Router();

router.get('/notes', handleReadRequest  as any);

router.get('/notes/:id', handleReadRequestById as any);

router.post('/notes', handleAddRequest as any);

router.put('/notes/:id', handleUpdateRequest as any);

router.delete('/notes/:id', handleDeleteRequest as any);

export default router;
