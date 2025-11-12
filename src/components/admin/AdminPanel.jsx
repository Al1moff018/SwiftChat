import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, MessageCircle, BarChart3, Shield, Search, Plus } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiRequest } = useAuth();

  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'chats') {
      loadChats();
    }
  }, [activeTab]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/admin/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/admin/users');
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/admin/chats');
      if (data.success) {
        setChats(data.data.chats);
      }
    } catch (error) {
      console.error('Load chats error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserBlock = async (userId, isBlocked) => {
    try {
      const data = await apiRequest(`/admin/users/${userId}/block`, {
        method: 'PATCH',
        body: { isBlocked: !isBlocked }
      });
      
      if (data.success) {
        loadUsers(); // Yangilash
      }
    } catch (error) {
      console.error('Toggle user block error:', error);
    }
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm('Chatni o\'chirishni tasdiqlaysizmi?')) return;
    
    try {
      const data = await apiRequest(`/admin/chats/${chatId}`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        loadChats(); // Yangilash
      }
    } catch (error) {
      console.error('Delete chat error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">SwiftChat boshqaruvi</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'stats' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 size={18} />
              <span>Statistika</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'users' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users size={18} />
              <span>Foydalanuvchilar</span>
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'chats' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MessageCircle size={18} />
              <span>Chatlar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Tab */}
              {activeTab === 'stats' && stats && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Umumiy Statistika</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary-600">{stats.totalUsers}</div>
                      <div className="text-gray-600">Jami Foydalanuvchilar</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{stats.onlineUsers}</div>
                      <div className="text-gray-600">Onlayn Foydalanuvchilar</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalChats}</div>
                      <div className="text-gray-600">Jami Chatlar</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalMessages}</div>
                      <div className="text-gray-600">Jami Xabarlar</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Barcha Foydalanuvchilar</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Qidirish..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Foydalanuvchi</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Holat</th>
                          <th className="text-left py-3 px-4">Ro'yxatdan o'tgan</th>
                          <th className="text-left py-3 px-4">Harakatlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{user.username}</div>
                                  {user.bio && <div className="text-sm text-gray-500">{user.bio}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className={user.isBlocked ? 'text-red-600' : 'text-gray-600'}>
                                  {user.isBlocked ? 'Bloklangan' : user.isOnline ? 'Onlayn' : 'Offlayn'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleUserBlock(user._id, user.isBlocked)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                  user.isBlocked 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {user.isBlocked ? 'Blokdan ol' : 'Blokla'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Chats Tab */}
              {activeTab === 'chats' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Barcha Chatlar</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {chats.map(chat => (
                      <div key={chat._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {chat.type === 'private' 
                                  ? chat.participants[0]?.user?.username?.charAt(0).toUpperCase() 
                                  : chat.name?.charAt(0).toUpperCase()
                                }
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {chat.type === 'private' 
                                    ? `${chat.participants[0]?.user?.username} bilan chat`
                                    : chat.name
                                  }
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="capitalize">{chat.type}</span>
                                  <span>{chat.participants.length} a'zo</span>
                                  <span>Yaratuvchi: {chat.createdBy?.username}</span>
                                </div>
                              </div>
                            </div>
                            {chat.description && (
                              <p className="text-gray-600 text-sm">{chat.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => deleteChat(chat._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                            >
                              O'chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;