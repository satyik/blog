const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Cloudinary Config Error: CLOUDINARY_CLOUD_NAME is missing from .env');
} else {
    console.log('✅ Cloudinary Config: CLOUDINARY_CLOUD_NAME is set to:', process.env.CLOUDINARY_CLOUD_NAME);
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
