import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import MessageItem from './MessageItem';

const MessageList = () => {
  const { messages, currentChat } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">SwiftChat ga xush kelibsiz!</h3>
          <p>Suhbat qilishni boshlash uchun chat tanlang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-4xl mx-auto py-4 px-4 space-y-4">
        {messages
          .filter(message => !currentChat || message.chat === currentChat._id)
          .map((message) => (
            <MessageItem 
              key={message._id || message.id || `msg-${message.timestamp}-${Math.random()}`} 
              message={message} 
            />
          ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;