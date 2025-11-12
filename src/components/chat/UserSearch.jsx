import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Search, UserPlus, X } from 'lucide-react';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { apiRequest } = useAuth();
  const { createChat, setCurrentChat } = useChat();

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await apiRequest(`/users/search?query=${encodeURIComponent(query)}`);
      if (data.success) {
        setSearchResults(data.data.users);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCreateChat = async (user) => {
    try {
      const data = await apiRequest('/chats/private', {
        method: 'POST',
        body: { participantId: user._id }
      });

      if (data.success) {
        setCurrentChat(data.data.chat);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Create chat error:', error);
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Foydalanuvchilarni qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map(user => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => handleCreateChat(user)}
                className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                title="Chat qo'shish"
              >
                <UserPlus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="mt-3 text-center text-gray-500">
          Izlanmoqda...
        </div>
      )}
    </div>
  );
};

export default UserSearch;