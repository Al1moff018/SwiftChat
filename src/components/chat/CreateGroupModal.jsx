import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { X, Search, UserPlus, Users } from 'lucide-react';

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiRequest } = useAuth();
  const { createChat } = useChat();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async (query) => {
    try {
      const data = await apiRequest(`/users/search?query=${encodeURIComponent(query)}`);
      if (data.success) {
        const filteredResults = data.data.users.filter(
          user => !selectedUsers.find(selected => selected._id === user._id)
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupData.name.trim() || selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      const participantIds = selectedUsers.map(user => user._id);
      await createChat({
        name: groupData.name,
        description: groupData.description,
        participantIds,
        isPublic: groupData.isPublic
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Create group error:', error);
      alert('Guruh yaratishda xatolik: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setGroupData({ name: '', description: '', isPublic: true });
    setSelectedUsers([]);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {step === 1 ? 'Guruh yaratish' : 'A\'zolarni tanlash'}
          </h3>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Guruh nomi *
                </label>
                <input
                  type="text"
                  value={groupData.name}
                  onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Guruh nomini kiriting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tavsif (ixtiyoriy)
                </label>
                <textarea
                  value={groupData.description}
                  onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Guruh haqida qisqacha tavsif"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={groupData.isPublic}
                  onChange={(e) => setGroupData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                  Ochiq guruh (barcha ko'ra oladi)
                </label>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!groupData.name.trim()}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Keyingi qadam
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Foydalanuvchilarni qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanlangan a'zolar:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div
                        key={user._id}
                        className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{user.username}</span>
                        <button
                          onClick={() => handleUserRemove(user._id)}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{user.username}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <UserPlus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Orqaga
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={selectedUsers.length === 0 || isLoading}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Yaratilmoqda...' : 'Guruh yaratish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;