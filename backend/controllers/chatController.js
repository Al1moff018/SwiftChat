const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      'participants.user': userId,
      isActive: true
    })
    .populate('participants.user', 'username email avatar isOnline lastSeen')
    .populate('lastMessage')
    .populate('createdBy', 'username avatar')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: {
        chats
      }
    });
  } catch (error) {
    console.error('Get user chats xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.user': userId,
      isActive: true
    })
    .populate('participants.user', 'username email avatar isOnline lastSeen')
    .populate('lastMessage')
    .populate('createdBy', 'username avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat topilmadi'
      });
    }

    res.json({
      success: true,
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Get chat by id xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.createPrivateChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user._id;

    console.log('Creating private chat:', { userId, participantId });

    // O'zim bilan chat yaratishni oldini olish
    if (participantId === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'O\'zingiz bilan chat yarata olmaysiz'
      });
    }

    // Participant mavjudligini tekshirish
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    // Chat allaqachon mavjudligini tekshirish
    const existingChat = await Chat.findOne({
      type: 'private',
      'participants.user': { $all: [userId, participantId] },
      isActive: true
    });

    if (existingChat) {
      return res.json({
        success: true,
        data: {
          chat: existingChat
        }
      });
    }

    // Yangi chat yaratish
    const chat = await Chat.create({
      type: 'private',
      participants: [
        { user: userId, role: 'member' },
        { user: participantId, role: 'member' }
      ],
      createdBy: userId
    });

    await chat.populate('participants.user', 'username email avatar isOnline lastSeen');
    await chat.populate('createdBy', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Chat muvaffaqiyatli yaratildi',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Create private chat xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message
    });
  }
};

exports.createGroupChat = async (req, res) => {
  try {
    const { name, description, participantIds, isPublic = true } = req.body;
    const userId = req.user._id;

    console.log('Creating group chat:', { name, participantIds, userId });

    // Barcha participantlar mavjudligini tekshirish
    const participants = await User.find({
      _id: { $in: participantIds }
    });

    if (participants.length !== participantIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Ba\'zi foydalanuvchilar topilmadi'
      });
    }

    // Yangi guruh chat yaratish
    const chat = await Chat.create({
      name,
      description,
      type: 'group',
      participants: [
        { user: userId, role: 'creator' },
        ...participantIds.map(id => ({ user: id, role: 'member' }))
      ],
      createdBy: userId,
      settings: {
        isPublic,
        canSendMessages: true,
        canAddUsers: true
      }
    });

    await chat.populate('participants.user', 'username email avatar isOnline lastSeen');
    await chat.populate('createdBy', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Guruh muvaffaqiyatli yaratildi',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Create group chat xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message
    });
  }
};

exports.createChannel = async (req, res) => {
  try {
    const { name, description, isPublic = true } = req.body;
    const userId = req.user._id;

    // Yangi kanal yaratish
    const chat = await Chat.create({
      name,
      description,
      type: 'channel',
      participants: [{ user: userId, role: 'creator' }],
      createdBy: userId,
      settings: {
        isPublic,
        canSendMessages: false,
        canAddUsers: true
      }
    });

    await chat.populate('participants.user', 'username email avatar isOnline lastSeen');
    await chat.populate('createdBy', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Kanal muvaffaqiyatli yaratildi',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.addUserToChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.user': currentUserId,
      'participants.role': { $in: ['creator', 'admin'] }
    });

    if (!chat) {
      return res.status(403).json({
        success: false,
        message: 'Sizda bu chatga foydalanuvchi qo\'shish uchun ruxsat yo\'q'
      });
    }

    // Foydalanuvchi mavjudligini tekshirish
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    // Foydalanuvchi allaqachon chatda bormi?
    const existingParticipant = chat.participants.find(p => p.user.toString() === userId);
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Foydalanuvchi allaqachon chatda mavjud'
      });
    }

    chat.participants.push({ user: userId, role: 'member' });
    await chat.save();

    await chat.populate('participants.user', 'username email avatar isOnline lastSeen');

    res.json({
      success: true,
      message: 'Foydalanuvchi chatga muvaffaqiyatli qo\'shildi',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Add user to chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name, description, avatar, settings } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.user': userId,
      'participants.role': { $in: ['creator', 'admin'] }
    });

    if (!chat) {
      return res.status(403).json({
        success: false,
        message: 'Sizda bu chatni tahrirlash uchun ruxsat yo\'q'
      });
    }

    if (name) chat.name = name;
    if (description) chat.description = description;
    if (avatar) chat.avatar = avatar;
    if (settings) chat.settings = { ...chat.settings, ...settings };

    await chat.save();
    await chat.populate('participants.user', 'username email avatar isOnline lastSeen');

    res.json({
      success: true,
      message: 'Chat muvaffaqiyatli yangilandi',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};