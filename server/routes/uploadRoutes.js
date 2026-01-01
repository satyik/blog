const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Upload Middleware Error:', err);
            // Log full error object for debugging
            console.dir(err, { depth: null });

            return res.status(500).json({
                message: 'Image upload failed',
                error: err.message || 'Unknown error',
                details: err
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            res.json({ url: req.file.path });
        } catch (error) {
            console.error('❌ Post-Upload Error:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router;
