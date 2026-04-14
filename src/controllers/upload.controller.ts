import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendNoContent } from '../utils/apiResponse';
import { UploadService } from '../services/upload.service';

/** Only these folder names are accepted for uploads */
const ALLOWED_UPLOAD_FOLDERS = new Set(['devices', 'brands', 'models', 'addons', 'repairs', 'misc']);

/**
 * S3 key must look like:  <folder>/<uuid-or-timestamp>.<ext>
 * This prevents path-traversal and arbitrary bucket access.
 */
const S3_KEY_PATTERN = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_\-.]+$/;

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file provided' });
    return;
  }

  const requested = (req.query.folder as string || '').trim();
  const folder    = ALLOWED_UPLOAD_FOLDERS.has(requested) ? requested : 'misc';
  const mimeType  = req.file.mimetype;
  const result    = await UploadService.uploadToS3(req.file.buffer, folder, mimeType);
  sendSuccess(res, result, 'Image uploaded');
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.body;

  if (!key || typeof key !== 'string') {
    res.status(400).json({ success: false, message: 'S3 key is required' });
    return;
  }

  // Reject keys that don't match the expected pattern (no path traversal, no bucket root deletes)
  if (!S3_KEY_PATTERN.test(key)) {
    res.status(400).json({ success: false, message: 'Invalid S3 key format' });
    return;
  }

  // The folder prefix must be an allowed folder
  const folder = key.split('/')[0];
  if (!ALLOWED_UPLOAD_FOLDERS.has(folder)) {
    res.status(400).json({ success: false, message: 'Invalid S3 key — unknown folder' });
    return;
  }

  await UploadService.deleteFromS3(key);
  sendNoContent(res);
});
