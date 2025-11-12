const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Barcha foydalanuvchilarni olish (admin uchun)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('username email avatar isOnline lastSeen bio createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

// Barcha chatlarni olish (admin uchun)
exports.getAllChats = async (req, res) => {
  try {
    const { page = 1, limit = 20, type = '' } = req.query;
    
    const query = { isActive: true };
    if (type) {
      query.type = type;
    }

    const chats = await Chat.find(query)
      .populate('participants.user', 'username avatar')
      .populate('createdBy', 'username')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Chat.countDocuments(query);

    res.json({
      success: true,
      data: {
        chats,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get all chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

// Statistika olish
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();
    const totalMessages = await Message.countDocuments();
    const onlineUsers = await User.countDocuments({ isOnline: true });

    // Oxirgi 7 kunlik foydalanuvchi qo'shilish statistikasi
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalChats,
        totalMessages,
        onlineUsers,
        userStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

// Foydalanuvchini bloklash/ochish
exports.toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    res.json({
      success: true,
      message: `Foydalanuvchi ${isBlocked ? 'bloklandi' : 'blokdan olindi'}`,
      data: { user }
    });
  } catch (error) {
    console.error('Toggle user block error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

// Chatni o'chirish
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat topilmadi'
      });
    }

    // Chatdagi barcha xabarlarni ham o'chirish
    await Message.updateMany(
      { chat: chatId },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Chat muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};