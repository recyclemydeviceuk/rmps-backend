import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// POST /api/upload  — upload an image to Cloudinary
router.post('/', uploadSingle, uploadImage);

// DELETE /api/upload — delete an image from Cloudinary by publicId
router.delete('/', deleteImage);

export default router;
