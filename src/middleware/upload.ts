import multer, { FileFilterCallback } from 'multer';

// Store in memory so we can pipe directly to Cloudinary
const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize:      5 * 1024 * 1024, // 5 MB per file
    fieldNameSize: 100,              // field name max 100 bytes
    fieldSize:     10 * 1024,        // non-file field value max 10 KB
    fields:        10,               // max 10 non-file fields per request
    files:         5,                // max 5 files per request
  },
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

// Single image field named "image"
export const uploadSingle = uploadMiddleware.single('image');

// Multiple images (e.g. gallery, up to 5)
export const uploadMultiple = uploadMiddleware.array('images', 5);
