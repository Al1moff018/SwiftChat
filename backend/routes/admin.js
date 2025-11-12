const express = require('express');
const {
  getAllUsers,
  getAllChats,
  getStats,
  toggleUserBlock,
  deleteChat
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/users', getAllUsers);
router.get('/chats', getAllChats);
router.get('/stats', getStats);
router.patch('/users/:userId/block', toggleUserBlock);
router.delete('/chats/:chatId', deleteChat);

module.exports = router;