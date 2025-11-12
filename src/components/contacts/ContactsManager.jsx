import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Users, Search, Star, MoreVertical } from 'lucide-react';

const ContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [savedContacts, setSavedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { apiRequest } = useAuth();

  useEffect(() => {
    loadContacts();
    loadSavedContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await apiRequest('/users/contacts');
      if (data.success) {
        setContacts(data.data.contacts);
      }
    } catch (error) {
      console.error('Load contacts error:', error);
    }
  };

  const loadSavedContacts = async () => {
    // LocalStorage dan saqlangan kontaktlarni olish
    const saved = JSON.parse(localStorage.getItem('saved_contacts') || '[]');
    setSavedContacts(saved);
  };

  const saveContact = (contact, customName = '') => {
    const savedContact = {
      ...contact,
      customName: customName || contact.username,
      savedAt: new Date().toISOString()
    };

    const updatedSaved = [...savedContacts, savedContact];
    setSavedContacts(updatedSaved);
    localStorage.setItem('saved_contacts', JSON.stringify(updatedSaved));
  };

  const removeSavedContact = (contactId) => {
    const updatedSaved = savedContacts.filter(contact => contact._id !== contactId);
    setSavedContacts(updatedSaved);
    localStorage.setItem('saved_contacts', JSON.stringify(updatedSaved));
  };

  const searchUsers = async (query) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    try {
      const data = await apiRequest(`/users/search?query=${encodeURIComponent(query)}`);
      if (data.success) {
        // Saqlangan kontaktlarni olib tashlash
        const filtered = data.data.users.filter(
          user => !savedContacts.find(saved => saved._id === user._id)
        );
        setContacts(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kontaktlar Boshqaruvi</h1>
        <p className="text-gray-600">Kontaktlaringizni boshqaring va saqlang</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Kontaktlarni qidirish..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Saved Contacts */}
      {savedContacts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Star className="text-yellow-500" size={20} />
            <span>Saqlangan Kontaktlar</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedContacts.map(contact => (
              <div key={contact._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {contact.customName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{contact.customName}</div>
                      <div className="text-sm text-gray-500">@{contact.username}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSavedContact(contact._id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Email: {contact.email}</div>
                  <div>Saqlangan: {new Date(contact.savedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Contacts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Barcha Kontaktlar</h2>
        <div className="bg-white border border-gray-200 rounded-lg">
          {contacts.map(contact => (
            <div key={contact._id} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {contact.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{contact.username}</div>
                  <div className="text-sm text-gray-500">{contact.email}</div>
                  {contact.bio && <div className="text-sm text-gray-600">{contact.bio}</div>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const customName = prompt('Kontakt uchun nom kiriting:', contact.username);
                    if (customName) {
                      saveContact(contact, customName);
                    }
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Saqlash</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactsManager;