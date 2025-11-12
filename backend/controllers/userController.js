const User = require('../models/User');
const Chat = require('../models/Chat');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Qidiruv so\'rovi kamida 2 ta belgidan iborat bo\'lishi kerak'
      });
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        },
        { _id: { $ne: userId } }
      ]
    })
    .select('username email avatar isOnline lastSeen bio')
    .limit(20);

    res.json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio, phone } = req.body;
    const userId = req.user._id;

    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ email }, { username }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email yoki username allaqachon mavjud'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profil muvaffaqiyatli yangilandi',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('username email avatar isOnline lastSeen bio phone');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profil rasmi muvaffaqiyatli yangilandi',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Foydalanuvchining barcha chatlaridan kontaktlarni olish
    const chats = await Chat.find({
      'participants.user': userId,
      type: 'private',
      isActive: true
    })
    .populate('participants.user', 'username email avatar isOnline lastSeen bio')
    .select('participants');

    const contacts = chats.map(chat => {
      const otherUser = chat.participants.find(p => p.user._id.toString() !== userId.toString());
      return otherUser ? otherUser.user : null;
    }).filter(Boolean);

    res.json({
      success: true,
      data: {
        contacts
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};