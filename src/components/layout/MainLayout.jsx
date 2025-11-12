import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import Sidebar from './Sidebar';
import MessageList from '../chat/MessageList';
import ChatInput from '../chat/ChatInput';
import ChatHeader from '../chat/ChatHeader';
import ProfileSettings from '../settings/ProfileSettings';
import Home from '../Home';
import ContactsManager from '../contacts/ContactsManager';
import AdminPanel from '../admin/AdminPanel';

const MainLayout = () => {
  const [activeView, setActiveView] = useState('home');
  const { currentChat } = useChat();

  const renderMainContent = () => {
    switch (activeView) {
      case 'settings':
        return <ProfileSettings onBack={() => setActiveView('chat')} />;
      case 'contacts':
        return <ContactsManager onBack={() => setActiveView('chat')} />;
      case 'admin':
        return <AdminPanel onBack={() => setActiveView('chat')} />;
      case 'chat':
        return (
          <>
            <ChatHeader />
            <MessageList />
            <ChatInput />
          </>
        );
      case 'home':
      default:
        return <Home />;
    }
  };

  // Agar chat tanlangan bo'lsa, chat view ga o'tkazamiz
  React.useEffect(() => {
    if (currentChat && activeView !== 'chat') {
      setActiveView('chat');
    } else if (!currentChat && activeView === 'chat') {
      setActiveView('home');
    }
  }, [currentChat, activeView]);

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
        <Sidebar onViewChange={setActiveView} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default MainLayout;