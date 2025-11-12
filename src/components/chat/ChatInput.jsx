import React, { useState } from 'react'
import { useChat } from '../../contexts/ChatContext'
import { Send, Smile, Paperclip } from 'lucide-react'

const ChatInput = () => {
  const [message, setMessage] = useState('')
  const { sendMessage, currentChat } = useChat()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && currentChat) {
      sendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!currentChat) return null

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Xabar yozing..."
              rows="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
              style={{ minHeight: '48px' }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInput