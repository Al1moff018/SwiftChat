const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  SEND_MESSAGE: 'sendMessage',
  USER_CONNECTED: 'userConnected',
  USER_DISCONNECTED: 'userDisconnected',
  ONLINE_USERS: 'onlineUsers',
  MESSAGE_READ: 'messageRead',
  MARK_AS_READ: 'markAsRead'
};

const CHAT_TYPES = {
  PRIVATE: 'private',
  GROUP: 'group',
  CHANNEL: 'channel'
};

const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
};

module.exports = { SOCKET_EVENTS, CHAT_TYPES, MESSAGE_STATUS };