import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import Sidebar from './components/Sidebar';
import Playground from './components/Playground';
import LoginPage from './components/LoginPage';
import { PlaygroundProvider, usePlayground } from './context/PlaygroundContext';

// Main App component that handles authentication flow
function AppContent() {
  const { isAuthenticated } = usePlayground();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If authenticated, show main playground
  return (
    <div className="flex h-screen bg-chat-bg text-white">
      {/* Mobile sidebar overlays */}
      {leftSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}
      {rightSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar - Chat Components */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0 lg:w-80
        ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <LeftSidebar onClose={() => setLeftSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Playground 
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
          leftSidebarOpen={leftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
        />
      </div>
      
      {/* Right Sidebar - Model Selection & Settings */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0 lg:w-80
        ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <Sidebar onClose={() => setRightSidebarOpen(false)} />
      </div>
    </div>
  );
}

function App() {
  const [initialChatId, setInitialChatId] = useState(null);

  useEffect(() => {
    // Check for chatId parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');
    if (chatId) {
      setInitialChatId(chatId);
    }
  }, []);

  return (
    <PlaygroundProvider initialChatId={initialChatId}>
      <AppContent />
    </PlaygroundProvider>
  );
}

export default App;