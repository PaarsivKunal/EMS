import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Configure allowed file types
const ALLOWED_FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    any: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf']
};

// Configure maximum file sizes (in bytes)
const MAX_FILE_SIZES = {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    any: 10 * 1024 * 1024 // 10MB
};

// Validate file type
export const validateFileType = (allowedTypes, file, res) => {
    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'No file provided'
        });
    }

    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
            receivedType: file.mimetype
        });
    }

    return true;
};

// Validate file size
export const validateFileSize = (maxSize, file, res) => {
    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'No file provided'
        });
    }

    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return res.status(400).json({
            success: false,
            message: `File too large. Maximum size: ${maxSizeMB}MB`,
            fileSize: (file.size / (1024 * 1024)).toFixed(2)
        });
    }

    return true;
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.params.type || 'general';
        const uploadPath = `./uploads/${uploadType}`;
        
        // Create directory if it doesn't exist (synchronously to avoid race conditions)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Use cryptographically secure random bytes instead of Math.random()
        // Remove original filename to prevent path traversal and injection attacks
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
        const ext = path.extname(file.originalname).toLowerCase();
        // Generate secure random filename - only preserve safe extension
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// File filter function
const fileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
        }
    };
};

// Create upload middleware
export const createUploadMiddleware = (type = 'any', single = true) => {
    const allowedTypes = ALLOWED_FILE_TYPES[type] || ALLOWED_FILE_TYPES.any;
    const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.any;

    const upload = multer({
        storage,
        limits: {
            fileSize: maxSize
        },
        fileFilter: fileFilter(allowedTypes)
    });

    return single ? upload.single('file') : upload.array('files', 5);
};

// Profile photo upload middleware
export const uploadProfilePhoto = createUploadMiddleware('image', true);

// Document upload middleware
export const uploadDocument = createUploadMiddleware('document', true);

// Multiple files upload middleware
export const uploadMultiple = createUploadMiddleware('any', false);

// Generic upload middleware
export const uploadFile = createUploadMiddleware('any', true);

export default {
    uploadProfilePhoto,
    uploadDocument,
    uploadMultiple,
    uploadFile,
    validateFileType,
    validateFileSize
};
