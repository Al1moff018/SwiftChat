const express = require('express');
const {
  getUserChats,
  getChatById,
  createPrivateChat,
  createGroupChat,
  createChannel,
  addUserToChat,
  updateChat
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getUserChats);
router.get('/:chatId', getChatById);
router.post('/private', createPrivateChat);
router.post('/group', createGroupChat);
router.post('/channel', createChannel);
router.post('/:chatId/add-user', addUserToChat);
router.put('/:chatId', updateChat);

module.exports = router;