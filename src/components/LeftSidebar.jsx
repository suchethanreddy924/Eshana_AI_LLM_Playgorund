import React, { useState } from 'react';
import { X, MessageSquare, Home } from 'lucide-react';
import { usePlayground } from '../context/PlaygroundContext';
import ChatHistory from './ChatHistory';
import SystemInstructionsInline from './SystemInstructionsInline';

const LeftSidebar = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const { clearMessages, currentUser, logout, startNewChat } = usePlayground();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="h-full flex flex-col">
            {/* New Chat Button */}
            <button
              onClick={() => {
                startNewChat();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors text-gray-300 hover:bg-gray-700/50"
              title="Start Fresh Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">New Chat</span>
            </button>
            
            {/* Chat History */}
            <div className="flex-1">
              <ChatHistory />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-sidebar-bg border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 min-h-[72px]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">⚡</span>
          </div>
          <span className="text-lg font-semibold text-gray-200">LLM Playground</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                ${activeTab === tab.id 
                  ? 'bg-sidebar-bg text-white' 
                  : 'text-gray-300 hover:bg-gray-700/50'
                }
              `}
            >
               <Icon className="w-4 h-4" />
               <span className="text-sm">{tab.label}</span>
             </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* System Instructions (when chat is active) */}
      {activeTab === 'chat' && (
        <div className="border-t border-gray-700">
          <SystemInstructionsInline />
        </div>
      )}

      {/* User Section with Logout */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Welcome back!
              </p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;