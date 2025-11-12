const express = require('express');
const {
  searchUsers,
  getUserProfile,
  updateProfile,
  getUserById,
  updateAvatar,
  getContacts
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/search', searchUsers);
router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.put('/avatar', updateAvatar);
router.get('/contacts', getContacts);
router.get('/:userId', getUserById);

module.exports = router;