const express = require('express');

const router = express.Router();

const chatcontroller = require('../controllers/chat');

const authMiddleware = require('../middleware/auth');

router.post('/post-chat', authMiddleware.authenticate, chatcontroller.postChat);

router.get('/get-chats', authMiddleware.authenticate, chatcontroller.getChats);

router.post('/upload', chatcontroller.uploadFile);

module.exports = router;