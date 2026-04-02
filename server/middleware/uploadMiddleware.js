const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'collab-connect/others';
        let resource_type = 'auto';

        if (file.mimetype.startsWith('image/')) {
            folder = 'collab-connect/images';
            resource_type = 'image';
        } else if (file.mimetype.startsWith('video/')) {
            folder = 'collab-connect/videos';
            resource_type = 'video';
        } else if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) {
            folder = 'collab-connect/documents';
            resource_type = 'raw';
        }

        return {
            folder: folder,
            resource_type: resource_type,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
