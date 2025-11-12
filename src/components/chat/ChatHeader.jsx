import React from 'react'
import { useChat } from '../../contexts/ChatContext'
import { useAuth } from '../../contexts/AuthContext'
import { Wifi, WifiOff, MoreVertical, Users } from 'lucide-react'

const ChatHeader = () => {
  const { currentChat, isConnected } = useChat()
  const { user } = useAuth()

  if (!currentChat) {
    return (
      <div className="border-b bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">SwiftChat</h1>
          <p className="text-gray-500">Real-time messaging platform</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b bg-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {currentChat.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">{currentChat.name}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-500">
                  {isConnected ? 'Onlayn' : 'Offlayn'}
                </span>
              </div>
              {currentChat.members && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Users size={14} />
                  <span>{currentChat.members} a'zo</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{isConnected ? 'Ulandi' : 'Ulanmadi'}</span>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader