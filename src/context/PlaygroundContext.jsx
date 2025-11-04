import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const AI_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'o1-preview',
      'o1-mini'
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ]
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'gemini-1.0-pro-vision'
    ]
  },
  {
    id: 'meta',
    name: 'Meta',
    models: [
      'llama-3.3-70b',
      'llama-3.1-405b',
      'llama-3.1-70b',
      'llama-3.1-8b',
      'llama-3-70b',
      'llama-3-8b'
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    models: [
      'mistral-large-2407',
      'mistral-medium',
      'mistral-small',
      'mixtral-8x7b',
      'mixtral-8x22b',
      'pixtral-12b'
    ]
  },
  {
    id: 'xai',
    name: 'xAI',
    models: [
      'grok-2',
      'grok-2-mini',
      'grok-beta'
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: [
      'deepseek-v3',
      'deepseek-coder-v2',
      'deepseek-chat'
    ]
  },
  {
    id: 'alibaba',
    name: 'Alibaba',
    models: [
      'qwen-2.5-72b',
      'qwen-2.5-32b',
      'qwen-2.5-14b',
      'qwen-2.5-7b',
      'qwen-2-72b'
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    models: [
      'command-r-plus',
      'command-r',
      'command-light'
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    models: [
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-small-128k-online',
      'llama-3.1-sonar-large-128k-chat',
      'llama-3.1-sonar-small-128k-chat'
    ]
  }
];

const PlaygroundContext = createContext();

export const usePlayground = () => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
};

export const PlaygroundProvider = ({ children, initialChatId }) => {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0]);
  const [systemInstructions, setSystemInstructions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(initialChatId || null);
  const currentChatIdRef = useRef(initialChatId || null);
  const [settings, setSettings] = useState({
    provider: AI_PROVIDERS[0].id,
    model: AI_PROVIDERS[0].models[0],
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Load system instructions from localStorage on mount
  useEffect(() => {
    const savedInstructions = localStorage.getItem('systemInstructions');
    if (savedInstructions) {
      try {
        setSystemInstructions(JSON.parse(savedInstructions));
      } catch (error) {
        console.error('Failed to parse saved system instructions:', error);
      }
    }
  }, []);

  // Load specific chat if initialChatId is provided
  useEffect(() => {
    if (!initialChatId || !currentUser) return;
    const sessionsKey = `chatSessions:${currentUser.id}`;
    const chatSessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    const targetSession = chatSessions.find(session => session.id === initialChatId);
    
    if (targetSession) {
      // Load the chat messages if they exist
      const chatKey = `chat:${currentUser.id}:${initialChatId}`;
      const chatMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
      setMessages(chatMessages);
      currentChatIdRef.current = initialChatId;
      setCurrentChatId(initialChatId);
      
      // Update the window title to show the chat name
      document.title = `${targetSession.title} - LLM Playground`;
    }
  }, [initialChatId, currentUser]);

  // Save messages to localStorage whenever they change (per user)
  useEffect(() => {
    if (currentUser && currentChatId && messages.length > 0) {
      const chatKey = `chat:${currentUser.id}:${currentChatId}`;
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, currentChatId, currentUser]);

  const setChatId = (chatId) => {
    currentChatIdRef.current = chatId;
    setCurrentChatId(chatId);
  };

  const ensureChatId = () => {
    if (currentChatIdRef.current) return currentChatIdRef.current;
    const newId = `chat_${Date.now()}`;
    setChatId(newId);
    return newId;
  };

  const addMessage = (message) => {
    // Validate message structure
    if (!message || typeof message !== 'object') {
      console.error('Invalid message object:', message);
      return;
    }
    
    // Validate required fields
    if (!message.role || !['user', 'assistant', 'system'].includes(message.role)) {
      console.error('Invalid or missing message role:', message.role);
      return;
    }
    
    // Ensure content is a string
    const content = typeof message.content === 'string' ? message.content : '';
    
    // Ensure we have a chat ID synchronously
    if (!currentChatIdRef.current) {
      ensureChatId();
    }

    const newMessage = {
      ...message,
      content,
      id: message.id || `${message.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      role: message.role.toLowerCase(), // Normalize role case
    };
    
    setMessages(prev => {
      // Check for duplicate messages by ID first (most reliable)
      const existsById = prev.some(existingMsg => existingMsg.id === newMessage.id);
      if (existsById) {
        console.warn('Message with same ID already exists, skipping:', newMessage.id);
        return prev;
      }
      
      // Additional check for duplicate content (but only for non-empty, non-streaming messages)
      if (newMessage.content && newMessage.content.length > 0 && !newMessage.isStreaming) {
        const contentDuplicate = prev.some(existingMsg => 
          existingMsg.role === newMessage.role && 
          existingMsg.content === newMessage.content &&
          !existingMsg.isStreaming
        );
        
        if (contentDuplicate) {
          console.warn('Duplicate message content detected, skipping:', newMessage);
          return prev;
        }
      }
      
      return [...prev, newMessage];
    });
  };

  const updateMessageContent = (messageId, content) => {
    setMessages(prev => {
      const messageExists = prev.some(msg => msg.id === messageId);
      if (!messageExists) {
        console.warn('Attempted to update non-existent message:', messageId);
        return prev;
      }
      
      return prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              content, 
              isStreaming: content === '' ? msg.isStreaming : false,
              lastUpdated: new Date()
            }
          : msg
      );
    });
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setProvider = (providerId) => {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setSettings(prev => ({
        ...prev,
        provider: providerId,
        model: provider.models[0] // Set to first model of the provider
      }));
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Start a brand new chat: generate an ID and clear messages
  const startNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    setMessages([]);
    setChatId(newChatId);
    document.title = 'LLM Playground';
  };


  const cleanupDuplicateMessages = () => {
    setMessages(prev => {
      const seen = new Set();
      const cleaned = [];
      
      for (const message of prev) {
        const key = `${message.role}_${message.content}`;
        if (!seen.has(key) && !seen.has(message.id)) {
          seen.add(key);
          seen.add(message.id);
          cleaned.push(message);
        }
      }
      
      if (cleaned.length !== prev.length) {
        console.log(`Cleaned up ${prev.length - cleaned.length} duplicate messages`);
      }
      
      return cleaned;
    });
  };

  const updateSystemInstructions = (instructions) => {
    setSystemInstructions(instructions);
    // Save to localStorage
    localStorage.setItem('systemInstructions', JSON.stringify(instructions));
  };

  // Safely parse JSON responses, falling back when body is empty or not JSON
  const safeParseJSON = async (response) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      const text = await response.text();
      try {
        return text ? JSON.parse(text) : {};
      } catch {
        return {};
      }
    } catch {
      return {};
    }
  };

  // Authentication functions
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeParseJSON(response);

      if (!response.ok) {
        const fallback = response.status === 404
          ? 'No account found for this email. Please sign up first.'
          : (response.status === 401 ? 'Incorrect password' : 'Login failed');
        throw new Error((data && data.error) || fallback);
      }

      // Set current user and authenticate
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await safeParseJSON(response);

      if (!response.ok) {
        throw new Error((data && data.error) || 'Signup failed');
      }

      // Set current user and authenticate
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Reset chat state so next login starts fresh
    setMessages([]);
    setChatId(null);
    document.title = 'LLM Playground';
    localStorage.removeItem('currentUser');
  };

  // Open a chat session in-page by loading its messages and setting currentChatId
  const openChatSession = (sessionId) => {
    if (!currentUser || !sessionId) return;
    const chatKey = `chat:${currentUser.id}:${sessionId}`;
    const chatMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
    setMessages(chatMessages);
    setChatId(sessionId);

    // Update window title based on session title
    const sessionsKey = `chatSessions:${currentUser.id}`;
    const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    const target = sessions.find(s => s.id === sessionId);
    document.title = target ? `${target.title} - LLM Playground` : 'LLM Playground';
  };

  const value = {
    messages,
    currentChatId,
    settings,
    isGenerating,
    availableProviders: AI_PROVIDERS,
    selectedProvider,
    systemInstructions,
    addMessage,
    updateMessageContent,
    updateSettings,
    setProvider,
    clearMessages,
    cleanupDuplicateMessages,
    setIsGenerating,
    updateSystemInstructions,
    ensureChatId,
    // Authentication
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    startNewChat,
    openChatSession,
  };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
};