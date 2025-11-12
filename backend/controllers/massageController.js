const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Chat mavjudligini va foydalanuvchi a'zo ekanligini tekshirish
    const chat = await Chat.findOne({
      _id: chatId,
      'participants.user': userId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat topilmadi'
      });
    }

    // Xabarlarni olish
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar')
      .populate('repliedTo')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text, repliedTo } = req.body;
    const userId = req.user._id;

    // Chat mavjudligini va foydalanuvchi a'zo ekanligini tekshirish
    const chat = await Chat.findOne({
      _id: chatId,
      'participants.user': userId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat topilmadi'
      });
    }

    // Yangi xabar yaratish
    const message = await Message.create({
      chat: chatId,
      sender: userId,
      text: text.trim(),
      repliedTo: repliedTo || null
    });

    // Chatning oxirgi xabarini yangilash
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    // Xabarni populate qilish
    await message.populate('sender', 'username avatar');
    await message.populate('repliedTo');

    res.status(201).json({
      success: true,
      message: 'Xabar muvaffaqiyatli yuborildi',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Xabar yuborishda xatolik'
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          readBy: {
            user: userId,
            readAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('sender', 'username avatar');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Xabar topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Xabar o\'qilgan deb belgilandi',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Xabar topilmadi yoki sizga ruxsat yo\'q'
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Xabar muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};