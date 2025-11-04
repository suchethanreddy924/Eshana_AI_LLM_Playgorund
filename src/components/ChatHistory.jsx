import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { usePlayground } from '../context/PlaygroundContext';

const ChatHistory = () => {
  const { messages, clearMessages, currentUser, openChatSession, currentChatId } = usePlayground();
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const createdSessionIds = useRef(new Set());

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    if (!currentUser) return;
    const sessionsKey = `chatSessions:${currentUser.id}`;
    const savedSessions = localStorage.getItem(sessionsKey);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Sort by lastUpdated desc to show latest first
        const sorted = Array.isArray(parsed)
          ? [...parsed].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
          : [];
        // Trim to last 5 and prune older sessions' stored messages
        const trimmed = sorted.slice(0, 5);
        const pruned = sorted.slice(5);
        if (pruned.length > 0) {
          pruned.forEach(s => {
            const chatKey = `chat:${currentUser.id}:${s.id}`;
            localStorage.removeItem(chatKey);
          });
          localStorage.setItem(sessionsKey, JSON.stringify(trimmed));
        }
        setChatSessions(trimmed);
        // Set the most recent session as active if none is active
        if (trimmed.length > 0 && !activeChatId) {
          setActiveChatId(trimmed[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved chat sessions:', error);
      }
    } else {
      // No sessions stored yet for this user; show empty history
      setChatSessions([]);
      setActiveChatId(null);
    }
  }, [activeChatId, currentUser]);

  // Keep activeChatId in sync with the context currentChatId
  useEffect(() => {
    if (!currentUser) return;
    if (currentChatId && currentChatId !== activeChatId) {
      setActiveChatId(currentChatId);
    }
  }, [currentChatId, currentUser]);

  // Save chat sessions to localStorage when messages change.
  // Use currentChatId from context as the authoritative ID to avoid
  // duplicate session creation when effects run rapidly.
  useEffect(() => {
    if (!currentUser) return;
    if (messages.length > 0 && currentChatId) {
      const sessionsKey = `chatSessions:${currentUser.id}`;
      const stored = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      const title = getSessionTitle(messages);

      const existingIndex = stored.findIndex(s => s.id === currentChatId);
      if (existingIndex >= 0) {
        // Update existing session
        const updated = [...stored];
        updated[existingIndex] = {
          ...updated[existingIndex],
          messages: [...messages],
          title,
          lastUpdated: new Date().toISOString(),
        };
        // Sort, trim, and persist
        updated.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        const trimmed = updated.slice(0, 5);
        const pruned = updated.slice(5);
        pruned.forEach(s => {
          const chatKey = `chat:${currentUser.id}:${s.id}`;
          localStorage.removeItem(chatKey);
        });
        localStorage.setItem(sessionsKey, JSON.stringify(trimmed));
        setChatSessions(trimmed);
        if (!trimmed.some(s => s.id === currentChatId)) {
          setActiveChatId(trimmed[0]?.id || null);
        }
      } else {
        if (createdSessionIds.current.has(currentChatId)) {
          // Already created in this render cycle, avoid duplicate create
          return;
        }
        createdSessionIds.current.add(currentChatId);
        // Create new session
        const newSession = {
          id: currentChatId,
          title,
          messages: [...messages],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        const updated = [newSession, ...stored];
        updated.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        const trimmed = updated.slice(0, 5);
        const pruned = updated.slice(5);
        pruned.forEach(s => {
          const chatKey = `chat:${currentUser.id}:${s.id}`;
          localStorage.removeItem(chatKey);
        });
        localStorage.setItem(sessionsKey, JSON.stringify(trimmed));
        setChatSessions(trimmed);
        if (!trimmed.some(s => s.id === currentChatId)) {
          setActiveChatId(trimmed[0]?.id || null);
        }
      }
    }
  }, [messages, currentChatId, currentUser]);

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    setActiveChatId(newChatId);
    clearMessages();
    openChatSession(newChatId);
  };

  const loadChatSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveChatId(sessionId);
      openChatSession(sessionId);
    }
  };

  const deleteChatSession = (sessionId, e) => {
    e.stopPropagation();
    if (!currentUser) return;
    const sessionsKey = `chatSessions:${currentUser.id}`;
    setChatSessions(prev => {
      const updated = prev.filter(session => session.id !== sessionId);
      localStorage.setItem(sessionsKey, JSON.stringify(updated));
      return updated;
    });
    
    if (activeChatId === sessionId) {
      if (chatSessions.length > 1) {
        const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
        setActiveChatId(remainingSessions[0]?.id || null);
      } else {
        createNewChat();
      }
    }
  };

  const getSessionTitle = (messages) => {
    const userMessage = messages.find(msg => msg.role === 'user');
    if (userMessage && userMessage.content) {
      return userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : '');
    }
    return 'New Chat';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </div>
      </div>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {chatSessions.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs mt-1">Start a conversation to see it here</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => loadChatSession(session.id)}
                className={`
                  group p-3 rounded-lg cursor-pointer transition-colors relative
                  ${activeChatId === session.id 
                    ? 'bg-gray-600/20 border border-gray-600/30' 
                    : 'hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-200 truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {getTimeAgo(session.lastUpdated)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChatSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;