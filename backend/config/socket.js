const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const onlineUsers = new Map();

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`✅ User connected: ${socket.username} (${socket.userId})`);

    // Onlayn holatini yangilash
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      userId: socket.userId,
      username: socket.username,
      connectedAt: new Date()
    });

    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Onlayn foydalanuvchilarni yangilash
    io.emit('onlineUsers', Array.from(onlineUsers.values()));

    // Chatga qo'shilish
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.username} joined chat ${chatId}`);
    });

    // Chatdan chiqish
    socket.on('leaveChat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.username} left chat ${chatId}`);
    });

    // Xabar yuborish
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, text } = data;

        // Chat mavjudligini tekshirish
        const chat = await Chat.findOne({
          _id: chatId,
          'participants.user': socket.userId,
          isActive: true
        });

        if (!chat) {
          socket.emit('error', { message: 'Chat topilmadi' });
          return;
        }

        // Yangi xabar yaratish
        const message = await Message.create({
          chat: chatId,
          sender: socket.userId,
          text: text.trim()
        });

        // Chatning oxirgi xabarini yangilash
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          updatedAt: new Date()
        });

        // Xabarni populate qilish
        await message.populate('sender', 'username avatar');

        // Chat a'zolariga xabarni yuborish
        io.to(chatId).emit('newMessage', message);

        console.log(`📨 New message in chat ${chatId} from ${socket.username}`);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Xabar yuborishda xatolik' });
      }
    });

    // Xabarni o'qilgan deb belgilash
    socket.on('markAsRead', async (data) => {
      try {
        const { messageId } = data;

        const message = await Message.findByIdAndUpdate(
          messageId,
          {
            $addToSet: {
              readBy: {
                user: socket.userId,
                readAt: new Date()
              }
            }
          },
          { new: true }
        ).populate('sender', 'username avatar');

        if (message) {
          io.to(message.chat.toString()).emit('messageRead', {
            messageId: message._id,
            readBy: socket.userId
          });
        }
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });

    // Ulanish uzilganda
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.username} (${socket.userId})`);

      // Onlayn holatini yangilash
      onlineUsers.delete(socket.userId);

      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Onlayn foydalanuvchilarni yangilash
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
      io.emit('userDisconnected', { userId: socket.userId });
    });
  });
};

module.exports = { setupSocket };