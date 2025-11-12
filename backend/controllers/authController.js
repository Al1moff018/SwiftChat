const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Email va username uniqligini tekshirish
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email yoki username allaqachon mavjud'
      });
    }

    // Yangi foydalanuvchi yaratish
    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi. Iltimos, keyinroq urinib ko\'ring.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Foydalanuvchini topish
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri'
      });
    }

    // Parolni tekshirish
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri'
      });
    }

    // Onlayn holatini yangilash
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Muvaffaqiyatli tizimga kirildi',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi. Iltimos, keyinroq urinib ko\'ring.'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get me xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Offline holatini yangilash
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date()
    });

    res.json({
      success: true,
      message: 'Muvaffaqiyatli tizimdan chiqildi'
    });
  } catch (error) {
    console.error('Logout xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};