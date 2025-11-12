const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation xatolari',
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username 3 dan 20 gacha belgidan iborat bo\'lishi kerak')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username faqat harflar, raqamlar va pastki chiziqdan iborat bo\'lishi kerak'),
  
  body('email')
    .isEmail()
    .withMessage('To\'g\'ri email manzilini kiriting')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('To\'g\'ri email manzilini kiriting')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Parol kiritilishi shart'),
  
  handleValidationErrors
];

module.exports = { registerValidation, loginValidation, handleValidationErrors };