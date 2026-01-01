const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/authMiddleware');

router.get('/', tagController.getTags);
router.post('/', auth, tagController.createTag);

module.exports = router;
