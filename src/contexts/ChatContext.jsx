import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user, apiRequest } = useAuth();
  const { socket, isConnected } = useWebSocket();

  // Chatlarni yuklash
  const loadChats = async () => {
    try {
      const data = await apiRequest('/chats');
      if (data.success) {
        setChats(data.data.chats);
      }
    } catch (error) {
      console.error('Load chats error:', error);
    }
  };

  // Xabarlarni yuklash
  const loadMessages = async (chatId) => {
    if (!chatId) return;
    
    try {
      const data = await apiRequest(`/messages/${chatId}`);
      if (data.success) {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  // Chat o'zgarganda xabarlarni yuklash
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat._id);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  // Socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Chatlar ro'yxatini yangilash
      setChats(prev => prev.map(chat => 
        chat._id === message.chat 
          ? { ...chat, lastMessage: message, updatedAt: new Date() }
          : chat
      ));
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('messageRead', (data) => {
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId ? { ...msg, read: true } : msg
      ));
    });

    socket.on('userConnected', (user) => {
      setOnlineUsers(prev => {
        if (!prev.find(u => u.userId === user.userId)) {
          return [...prev, user];
        }
        return prev;
      });
    });

    socket.on('userDisconnected', (userId) => {
      setOnlineUsers(prev => prev.filter(user => user.userId !== userId));
    });

    return () => {
      socket.off('newMessage');
      socket.off('onlineUsers');
      socket.off('messageRead');
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, [socket]);

  const sendMessage = async (text) => {
    if (!socket || !text.trim() || !currentChat) return;

    try {
      const message = {
        text: text.trim(),
        chatId: currentChat._id
      };

      socket.emit('sendMessage', message);
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const markAsRead = (messageId) => {
    if (!socket) return;
    socket.emit('markAsRead', { messageId });
  };

  const createChat = async (chatData) => {
    try {
      let data;
      
      if (chatData.participantIds) {
        // Group chat
        data = await apiRequest('/chats/group', {
          method: 'POST',
          body: chatData
        });
      } else if (chatData.participantId) {
        // Private chat
        data = await apiRequest('/chats/private', {
          method: 'POST',
          body: { participantId: chatData.participantId }
        });
      } else {
        throw new Error('Chat turi aniqlanmadi');
      }

      if (data.success) {
        const newChat = data.data.chat;
        setChats(prev => [newChat, ...prev]);
        setCurrentChat(newChat);
        return newChat;
      } else {
        throw new Error(data.message || 'Chat yaratishda xatolik');
      }
    } catch (error) {
      console.error('Create chat error:', error);
      throw error;
    }
  };

  const value = {
    messages,
    onlineUsers,
    currentChat,
    chats,
    isLoading,
    setCurrentChat,
    sendMessage,
    markAsRead,
    createChat,
    loadChats,
    isConnected
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;