import React from 'react'
import { useChat } from '../../contexts/ChatContext'
import Avatar from '../ui/Avatar'

const OnlineUsers = () => {
  const { onlineUsers } = useChat()

  return (
    <div className="bg-white border-b p-4">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">Onlayn Foydalanuvchilar</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin">
        {onlineUsers.map(user => (
          <div key={user.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
            <Avatar 
              alt={user.username} 
              size="medium" 
              online={true}
            />
            <span className="text-xs text-gray-600 max-w-16 truncate">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OnlineUsers