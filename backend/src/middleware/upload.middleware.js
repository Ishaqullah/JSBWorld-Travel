import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure disk storage (for regular file uploads)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Configure memory storage (for base64 conversion)
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload configuration (disk storage)
export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter,
});

// Multer upload configuration (memory storage for base64)
export const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter,
});

// Middleware for single file upload (disk)
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for single file upload (memory - for base64)
export const uploadSingleToMemory = (fieldName) => uploadMemory.single(fieldName);

// Middleware for multiple files upload
export const uploadMultiple = (fieldName, maxCount = 5) => 
  upload.array(fieldName, maxCount);

// Middleware for multiple fields
export const uploadFields = (fields) => upload.fields(fields);

