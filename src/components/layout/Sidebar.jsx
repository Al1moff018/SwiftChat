import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  LogOut, 
  User, 
  MessageCircle, 
  Plus, 
  Settings, 
  Users,
  Star,
  Archive,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import UserSearch from '../chat/UserSearch';
import CreateGroupModal from '../chat/CreateGroupModal';
import Avatar from '../ui/Avatar';

const Sidebar = ({ onViewChange }) => {
  const { chats, currentChat, setCurrentChat, onlineUsers, loadChats } = useChat();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chats');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const initializeChats = async () => {
      setIsLoading(true);
      await loadChats();
      setIsLoading(false);
    };
    initializeChats();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Kecha';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getLastMessageText = (chat) => {
    if (!chat.lastMessage) return 'Chat boshlandi';
    const text = chat.lastMessage.text;
    return text && text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  const getChatName = (chat) => {
    if (chat.type === 'private') {
      const otherUser = chat.participants?.find(p => p.user?._id !== user?._id);
      return otherUser?.user?.username || 'User';
    }
    return chat.name;
  };

  const getChatAvatar = (chat) => {
    if (chat.type === 'private') {
      const otherUser = chat.participants?.find(p => p.user?._id !== user?._id);
      return otherUser?.user?.username || 'User';
    }
    return chat.name;
  };

  const handleSettingsClick = () => {
    onViewChange('settings');
  };

  const handleNewChatClick = () => {
    setActiveTab('search');
  };

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    onViewChange('chat');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Saqlangan kontaktlar soni
  const savedContactsCount = JSON.parse(localStorage.getItem('saved_contacts') || '[]').length;

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Header - Telegram style */}
      <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">SwiftChat</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={darkMode ? 'Kun rejimi' : 'Tun rejimi'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Sozlamalar"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar - Telegram style */}
        <div className="mt-3">
          <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Qidirish..."
              onClick={() => setActiveTab('search')}
              className={`w-full pl-10 pr-4 py-2 bg-transparent focus:outline-none rounded-lg ${
                darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Tabs - Telegram style */}
      <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'chats'
              ? darkMode 
                ? 'border-blue-400 text-blue-400' 
                : 'border-blue-500 text-blue-500'
              : darkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Chatlar
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'contacts'
              ? darkMode 
                ? 'border-blue-400 text-blue-400' 
                : 'border-blue-500 text-blue-500'
              : darkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Kontaktlar
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'calls'
              ? darkMode 
                ? 'border-blue-400 text-blue-400' 
                : 'border-blue-500 text-blue-500'
              : darkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Qo'ng'iroqlar
        </button>
      </div>

      {/* Search Results */}
      {activeTab === 'search' && <UserSearch />}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Chats List */}
        {activeTab === 'chats' && (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : chats.length === 0 ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageCircle size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p>Hali chatlar mavjud emas</p>
                <p className="text-sm">Yangi chat boshlash uchun qidiruvdan foydalaning</p>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center p-3 cursor-pointer transition-colors ${
                    currentChat?._id === chat._id
                      ? darkMode ? 'bg-gray-700' : 'bg-blue-50'
                      : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  } border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <div className="flex-shrink-0 mr-3">
                    <Avatar 
                      alt={getChatAvatar(chat)} 
                      size="large"
                      online={chat.type === 'private' && chat.participants?.find(p => p.user?._id !== user?._id)?.user?.isOnline}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getChatName(chat)}
                      </h3>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0 ml-2`}>
                        {formatTime(chat.updatedAt)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getLastMessageText(chat)}
                    </p>
                    {chat.type !== 'private' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {chat.participants?.length || 0} a'zo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contacts List */}
        {activeTab === 'contacts' && (
          <div className="p-4">
            {/* Saved Contacts */}
            <div className="mb-6">
              <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Star className="text-yellow-500" size={18} />
                <span>Saqlangan kontaktlar ({savedContactsCount})</span>
              </h3>
              
              {(() => {
                const savedContacts = JSON.parse(localStorage.getItem('saved_contacts') || '[]');
                return savedContacts.length > 0 ? (
                  <div className="space-y-2">
                    {savedContacts.map(contact => (
                      <div
                        key={contact._id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            alt={contact.customName || contact.username} 
                            size="medium"
                          />
                          <div>
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {contact.customName || contact.username}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              @{contact.username}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newContacts = savedContacts.filter(c => c._id !== contact._id);
                            localStorage.setItem('saved_contacts', JSON.stringify(newContacts));
                            window.location.reload();
                          }}
                          className={`text-sm ${
                            darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                          }`}
                        >
                          O'chirish
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 rounded-lg ${
                    darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
                  }`}>
                    <Users size={32} className="mx-auto mb-3" />
                    <p className="text-sm">Saqlangan kontaktlar yo'q</p>
                  </div>
                );
              })()}
            </div>

            {/* All Contacts */}
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Barcha kontaktlar
              </h3>
              {chats.filter(chat => chat.type === 'private').length > 0 ? (
                <div className="space-y-2">
                  {chats
                    .filter(chat => chat.type === 'private')
                    .map(chat => {
                      const otherUser = chat.participants?.find(p => p.user?._id !== user?._id);
                      return otherUser ? (
                        <div
                          key={chat._id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                          } transition-colors`}
                          onClick={() => handleChatClick(chat)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar 
                              alt={otherUser.user?.username} 
                              size="medium"
                              online={otherUser.user?.isOnline}
                            />
                            <div>
                              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {otherUser.user?.username}
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {otherUser.user?.isOnline ? 'Onlayn' : 'Offlayn'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const customName = prompt('Kontakt uchun nom kiriting:', otherUser.user?.username);
                              if (customName) {
                                const savedContacts = JSON.parse(localStorage.getItem('saved_contacts') || '[]');
                                const newContact = {
                                  ...otherUser.user,
                                  customName,
                                  savedAt: new Date().toISOString()
                                };
                                const updatedContacts = [...savedContacts, newContact];
                                localStorage.setItem('saved_contacts', JSON.stringify(updatedContacts));
                                window.location.reload();
                              }
                            }}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              darkMode 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transition-colors`}
                          >
                            Saqlash
                          </button>
                        </div>
                      ) : null;
                    })
                    .filter(Boolean)
                  }
                </div>
              ) : (
                <div className={`text-center py-8 rounded-lg ${
                  darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
                }`}>
                  <MessageCircle size={32} className="mx-auto mb-3" />
                  <p className="text-sm">Hali shaxsiy chatlar yo'q</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calls Tab - Telegram style placeholder */}
        {activeTab === 'calls' && (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <HelpCircle size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p>Qo'ng'iroqlar tarixi</p>
            <p className="text-sm">Tez orada qo'shiladi</p>
          </div>
        )}
      </div>

      {/* New Chat Floating Button - Telegram style */}
      {activeTab === 'chats' && (
        <button
          onClick={() => setShowCreateGroup(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
            darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <Plus size={24} className="text-white" />
        </button>
      )}

      {/* Settings Menu */}
      {showSettings && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className={`w-full max-w-md mx-auto rounded-t-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">Sozlamalar</h3>
            </div>
            <div className="p-2">
              <button
                onClick={handleSettingsClick}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <User size={20} />
                <span>Profil</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{darkMode ? 'Kun rejimi' : 'Tun rejimi'}</span>
              </button>
              <button
                onClick={() => {
                  // Yordam sahifasiga o'tish
                  alert('Yordam sahifasi tez orada qo\'shiladi');
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <HelpCircle size={20} />
                <span>Yordam</span>
              </button>
              <button
                onClick={logout}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <LogOut size={20} />
                <span>Chiqish</span>
              </button>
            </div>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setShowSettings(false)}
                className={`w-full py-3 rounded-lg font-medium ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </div>
  );
};

export default Sidebar;