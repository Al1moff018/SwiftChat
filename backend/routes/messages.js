const express = require('express');
const {
  getChatMessages,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/massageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/:chatId', getChatMessages);
router.post('/:chatId/send', sendMessage);
router.patch('/:messageId/read', markAsRead);
router.delete('/:messageId', deleteMessage);

module.exports = router;