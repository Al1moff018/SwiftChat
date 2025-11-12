const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.type !== 'private';
    },
    trim: true
  },
  description: {
    type: String,
    maxlength: 255,
    default: ''
  },
  type: {
    type: String,
    enum: ['private', 'group', 'channel'],
    default: 'private'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'creator'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  avatar: {
    type: String,
    default: null
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    canSendMessages: {
      type: Boolean,
      default: true
    },
    canAddUsers: {
      type: Boolean,
      default: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Private chat uchun participantlar orqali tez izlash
chatSchema.index({ participants: 1, type: 1 });

module.exports = mongoose.model('Chat', chatSchema);