import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Check, CheckCheck } from 'lucide-react';

const MessageItem = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender?._id === user?.id || message.senderId === user?.id;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isOwnMessage 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
      }`}>
        <p className="text-sm">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isOwnMessage ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <span className="text-xs">{formatTime(message.timestamp || message.createdAt)}</span>
          {isOwnMessage && (
            message.read ? (
              <CheckCheck size={14} className="text-blue-200" />
            ) : (
              <Check size={14} className="text-blue-200" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;