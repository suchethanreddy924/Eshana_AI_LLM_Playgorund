import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, User, Loader2, MessageSquare, Code, Image, Search, Brain, Zap, Settings } from 'lucide-react';
import { usePlayground } from '../context/PlaygroundContext';

// Helper function to get model description
const getModelDescription = (providerId, model) => {
  const descriptions = {
    openai: {
      'gpt-4o': 'Advanced multimodal model with vision capabilities and enhanced reasoning',
      'gpt-4o-mini': 'Faster, cost-effective version of GPT-4o with strong performance',
      'gpt-4-turbo': 'Latest GPT-4 with improved instruction following and JSON mode',
      'gpt-4': 'Highly capable model for complex reasoning and creative tasks',
      'gpt-3.5-turbo': 'Fast and efficient model for most conversational tasks',
      'o1-preview': 'Advanced reasoning model with enhanced problem-solving capabilities',
      'o1-mini': 'Faster reasoning model optimized for coding and math'
    },
    anthropic: {
      'claude-3-5-sonnet-20241022': 'Most capable Claude model with advanced reasoning and coding',
      'claude-3-5-haiku-20241022': 'Fast and efficient model for quick responses',
      'claude-3-opus-20240229': 'Powerful model for complex analysis and creative writing',
      'claude-3-sonnet-20240229': 'Balanced model for general-purpose tasks',
      'claude-3-haiku-20240307': 'Quick and responsive model for simple tasks'
    },
    google: {
      'gemini-2.0-flash-exp': 'Latest experimental Gemini with enhanced capabilities',
      'gemini-1.5-pro': 'Advanced model with large context window and multimodal support',
      'gemini-1.5-flash': 'Fast model optimized for quick responses',
      'gemini-1.0-pro': 'Reliable model for general conversational tasks',
      'gemini-1.0-pro-vision': 'Multimodal model with image understanding capabilities'
    },
    meta: {
      'llama-3.3-70b': 'Latest Llama model with improved performance and capabilities',
      'llama-3.1-405b': 'Largest Llama model with exceptional reasoning abilities',
      'llama-3.1-70b': 'High-performance model for complex tasks',
      'llama-3.1-8b': 'Efficient model for general-purpose applications'
    },
    mistral: {
      'mistral-large-2407': 'Most capable Mistral model for complex reasoning',
      'mistral-medium': 'Balanced model for general-purpose tasks',
      'mistral-small': 'Efficient model for simple conversational tasks',
      'mixtral-8x7b': 'Mixture of experts model with strong performance',
      'pixtral-12b': 'Multimodal model with vision capabilities'
    },
    xai: {
      'grok-2': 'Advanced reasoning model with real-time information access',
      'grok-2-mini': 'Faster version of Grok with efficient performance',
      'grok-beta': 'Experimental model with cutting-edge capabilities'
    },
    deepseek: {
      'deepseek-v3': 'Latest DeepSeek model with enhanced reasoning',
      'deepseek-coder-v2': 'Specialized model for coding and programming tasks',
      'deepseek-chat': 'Conversational model for general chat applications'
    },
    alibaba: {
      'qwen-2.5-72b': 'Large Qwen model with strong multilingual capabilities',
      'qwen-2.5-32b': 'Mid-size model balancing performance and efficiency',
      'qwen-2.5-14b': 'Compact model for general-purpose tasks'
    },
    cohere: {
      'command-r-plus': 'Advanced model with enhanced reasoning and tool use',
      'command-r': 'Reliable model for conversational AI applications',
      'command-light': 'Lightweight model for simple tasks'
    },
    perplexity: {
      'llama-3.1-sonar-large-128k-online': 'Large model with real-time web search capabilities',
      'llama-3.1-sonar-small-128k-online': 'Efficient model with online information access',
      'llama-3.1-sonar-large-128k-chat': 'Large conversational model with extended context',
      'llama-3.1-sonar-small-128k-chat': 'Compact chat model with long context support'
    }
  };
  
  return descriptions[providerId]?.[model] || 'Advanced AI model for various tasks and applications';
};

// Helper function to get model capabilities
const getModelCapabilities = (providerId) => {
  const capabilities = {
    openai: [
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Advanced Conversations', description: 'Engage in complex, nuanced discussions with human-like understanding' },
      { icon: <Code className="w-6 h-6" />, title: 'Code Generation', description: 'Write, debug, and explain code in multiple programming languages' },
      { icon: <Image className="w-6 h-6" />, title: 'Vision Capabilities', description: 'Analyze and understand images, charts, and visual content' },
      { icon: <Brain className="w-6 h-6" />, title: 'Reasoning & Analysis', description: 'Solve complex problems with step-by-step logical reasoning' },
      { icon: <Zap className="w-6 h-6" />, title: 'Creative Writing', description: 'Generate creative content, stories, and artistic expressions' },
      { icon: <Search className="w-6 h-6" />, title: 'Research & Synthesis', description: 'Analyze information and provide comprehensive insights' }
    ],
    anthropic: [
      { icon: <Brain className="w-6 h-6" />, title: 'Constitutional AI', description: 'Helpful, harmless, and honest responses with strong safety measures' },
      { icon: <Code className="w-6 h-6" />, title: 'Code Analysis', description: 'Expert-level programming assistance and code review' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Long Conversations', description: 'Maintain context over extended discussions and documents' },
      { icon: <Zap className="w-6 h-6" />, title: 'Creative Tasks', description: 'Excel at creative writing, brainstorming, and ideation' },
      { icon: <Search className="w-6 h-6" />, title: 'Research & Analysis', description: 'Deep analysis of complex topics and information synthesis' },
      { icon: <Brain className="w-6 h-6" />, title: 'Ethical Reasoning', description: 'Thoughtful consideration of ethical implications and nuances' }
    ],
    google: [
      { icon: <Search className="w-6 h-6" />, title: 'Multimodal Understanding', description: 'Process text, images, and other media types seamlessly' },
      { icon: <Code className="w-6 h-6" />, title: 'Code Generation', description: 'Generate and explain code across multiple programming languages' },
      { icon: <Brain className="w-6 h-6" />, title: 'Large Context', description: 'Handle very long documents and maintain context effectively' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Conversational AI', description: 'Natural, engaging conversations with contextual awareness' },
      { icon: <Zap className="w-6 h-6" />, title: 'Fast Processing', description: 'Quick responses while maintaining high quality output' },
      { icon: <Image className="w-6 h-6" />, title: 'Vision Analysis', description: 'Understand and describe visual content in detail' }
    ],
    meta: [
      { icon: <Code className="w-6 h-6" />, title: 'Open Source Power', description: 'Leverage the transparency and flexibility of open-source AI' },
      { icon: <Brain className="w-6 h-6" />, title: 'Strong Reasoning', description: 'Excellent logical reasoning and problem-solving capabilities' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Multilingual Support', description: 'Communicate effectively in multiple languages' },
      { icon: <Zap className="w-6 h-6" />, title: 'Efficient Performance', description: 'High-quality outputs with optimized resource usage' },
      { icon: <Search className="w-6 h-6" />, title: 'Knowledge Synthesis', description: 'Combine information from various sources effectively' },
      { icon: <Code className="w-6 h-6" />, title: 'Technical Tasks', description: 'Excel at technical writing and complex problem solving' }
    ],
    mistral: [
      { icon: <Code className="w-6 h-6" />, title: 'Coding Excellence', description: 'Superior performance in programming and technical tasks' },
      { icon: <Brain className="w-6 h-6" />, title: 'Efficient Reasoning', description: 'Fast and accurate logical reasoning capabilities' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Multilingual Chat', description: 'Fluent conversation in multiple European languages' },
      { icon: <Zap className="w-6 h-6" />, title: 'Fast Responses', description: 'Quick processing while maintaining output quality' },
      { icon: <Search className="w-6 h-6" />, title: 'Information Processing', description: 'Efficient analysis and synthesis of complex information' },
      { icon: <Image className="w-6 h-6" />, title: 'Multimodal AI', description: 'Process both text and visual inputs effectively' }
    ],
    xai: [
      { icon: <Search className="w-6 h-6" />, title: 'Real-time Information', description: 'Access to current events and real-time data' },
      { icon: <Brain className="w-6 h-6" />, title: 'Advanced Reasoning', description: 'Cutting-edge reasoning capabilities with transparency' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Witty Conversations', description: 'Engaging discussions with humor and personality' },
      { icon: <Code className="w-6 h-6" />, title: 'Technical Analysis', description: 'Deep technical understanding and problem-solving' },
      { icon: <Zap className="w-6 h-6" />, title: 'Innovative Thinking', description: 'Creative approaches to complex challenges' },
      { icon: <Search className="w-6 h-6" />, title: 'Truth-seeking', description: 'Commitment to accuracy and factual information' }
    ],
    deepseek: [
      { icon: <Code className="w-6 h-6" />, title: 'Coding Specialist', description: 'Exceptional performance in programming and software development' },
      { icon: <Brain className="w-6 h-6" />, title: 'Deep Reasoning', description: 'Advanced logical reasoning and mathematical problem-solving' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Technical Communication', description: 'Clear explanation of complex technical concepts' },
      { icon: <Zap className="w-6 h-6" />, title: 'Efficient Processing', description: 'Fast and accurate responses for technical queries' },
      { icon: <Search className="w-6 h-6" />, title: 'Research Assistance', description: 'Help with technical research and analysis' },
      { icon: <Code className="w-6 h-6" />, title: 'Algorithm Design', description: 'Assist with algorithm development and optimization' }
    ],
    alibaba: [
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Multilingual Excellence', description: 'Superior performance in Chinese and other Asian languages' },
      { icon: <Brain className="w-6 h-6" />, title: 'Cultural Understanding', description: 'Deep knowledge of Asian cultures and contexts' },
      { icon: <Code className="w-6 h-6" />, title: 'Technical Proficiency', description: 'Strong capabilities in programming and technical tasks' },
      { icon: <Search className="w-6 h-6" />, title: 'Information Synthesis', description: 'Effective processing of diverse information sources' },
      { icon: <Zap className="w-6 h-6" />, title: 'Efficient Performance', description: 'Balanced speed and quality in responses' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Business Applications', description: 'Tailored for enterprise and business use cases' }
    ],
    cohere: [
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Enterprise Chat', description: 'Optimized for business and enterprise applications' },
      { icon: <Search className="w-6 h-6" />, title: 'RAG Integration', description: 'Excellent retrieval-augmented generation capabilities' },
      { icon: <Brain className="w-6 h-6" />, title: 'Tool Integration', description: 'Seamless integration with external tools and APIs' },
      { icon: <Code className="w-6 h-6" />, title: 'API-friendly', description: 'Designed for easy integration into applications' },
      { icon: <Zap className="w-6 h-6" />, title: 'Reliable Performance', description: 'Consistent and dependable output quality' },
      { icon: <Search className="w-6 h-6" />, title: 'Document Analysis', description: 'Effective processing of business documents' }
    ],
    perplexity: [
      { icon: <Search className="w-6 h-6" />, title: 'Real-time Search', description: 'Access to current web information and real-time data' },
      { icon: <Brain className="w-6 h-6" />, title: 'Research Assistant', description: 'Comprehensive research with source citations' },
      { icon: <MessageSquare className="w-6 h-6" />, title: 'Informed Conversations', description: 'Discussions backed by current, factual information' },
      { icon: <Zap className="w-6 h-6" />, title: 'Fast Information', description: 'Quick access to up-to-date knowledge and facts' },
      { icon: <Search className="w-6 h-6" />, title: 'Source Verification', description: 'Provides sources and citations for information' },
      { icon: <Code className="w-6 h-6" />, title: 'Technical Queries', description: 'Current technical information and documentation' }
    ]
  };
  
  return capabilities[providerId] || [
    { icon: <MessageSquare className="w-6 h-6" />, title: 'Conversational AI', description: 'Engage in natural, helpful conversations' },
    { icon: <Brain className="w-6 h-6" />, title: 'Problem Solving', description: 'Assist with various tasks and challenges' },
    { icon: <Code className="w-6 h-6" />, title: 'Technical Support', description: 'Help with coding and technical questions' },
    { icon: <Zap className="w-6 h-6" />, title: 'Creative Tasks', description: 'Support creative and innovative projects' },
    { icon: <Search className="w-6 h-6" />, title: 'Information Processing', description: 'Analyze and synthesize information effectively' },
    { icon: <MessageSquare className="w-6 h-6" />, title: 'General Assistance', description: 'Provide helpful responses across various topics' }
  ];
};

const Playground = ({ onToggleLeftSidebar, onToggleRightSidebar, leftSidebarOpen, rightSidebarOpen }) => {
  const { 
    messages, 
    settings, 
    isGenerating, 
    selectedProvider, 
    systemInstructions,
    addMessage, 
    updateMessageContent,
    setIsGenerating,
    clearMessages,
    currentChatId,
    ensureChatId
  } = usePlayground();
  const [input, setInput] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setIsGenerating(true);

    // Ensure a chat session ID exists before adding messages (synchronous)
    if (!currentChatId) {
      ensureChatId();
    }

    // Add user message with unique ID
    const userMessageId = `user_${Date.now()}`;
    addMessage({ 
      role: 'user', 
      content: userMessage,
      id: userMessageId
    });

    // Create a placeholder message for the assistant response with unique ID
    const assistantMessageId = `assistant_${Date.now() + 1}`;
    addMessage({ 
      role: 'assistant', 
      content: '', 
      id: assistantMessageId,
      isStreaming: true 
    });

    try {
      // Prepare system instructions
      const systemInstructionsText = systemInstructions
        .map(instruction => `${instruction.title}: ${instruction.content}`)
        .join('\n\n');

      // Prepare chat request
      const chatRequest = {
        provider: selectedProvider.id,
        model: settings.model,
        messages: messages.concat([{ role: 'user', content: userMessage }]),
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        topP: settings.topP,
        systemInstructions: systemInstructionsText || undefined
      };



      // Make API call to backend with streaming and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response from AI');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let isStreamComplete = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            isStreamComplete = true;
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                isStreamComplete = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content' && parsed.content) {
                  accumulatedContent += parsed.content;
                  // Update the message content in real-time
                  updateMessageContent(assistantMessageId, accumulatedContent);
                }
              } catch (parseError) {
                // Ignore parsing errors for malformed chunks
                console.warn('Failed to parse SSE data:', data);
              }
            }
          }
          
          if (isStreamComplete) break;
        }
      } finally {
        // Ensure the message is marked as complete
        if (accumulatedContent) {
          updateMessageContent(assistantMessageId, accumulatedContent);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = '';
      
      if (error.name === 'AbortError') {
        errorMessage = `Request timed out after 30 seconds. This usually indicates that your API key for ${selectedProvider.name} is missing or invalid. Please check your API configuration and try again.`;
      } else if (error.message.includes('API key') || error.message.includes('authentication') || error.message.includes('unauthorized')) {
        errorMessage = `Authentication failed with ${selectedProvider.name}. Please verify that your API key is correctly configured and has the necessary permissions.`;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = `Network error occurred. Please check your internet connection and try again.`;
      } else {
        errorMessage = `I apologize, but I encountered an error: ${error.message}. Please check your API keys and try again.`;
      }
      
      updateMessageContent(assistantMessageId, errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="flex flex-col h-full bg-sidebar-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 min-h-[72px]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleLeftSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            title="Toggle Chat Sidebar"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-semibold">{selectedProvider.name} - {settings.model}</h2>
            <p className="text-sm text-gray-400">
              Temperature: {settings.temperature} • Max Tokens: {settings.maxTokens}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleRightSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            title="Toggle Settings Sidebar"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>



      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-4xl w-full">
              {/* Main Title */}
              <h1 className="text-4xl font-light text-gray-200 mb-8">
                Build your ideas with {selectedProvider.name}
              </h1>
              
              {/* Model Info Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {selectedProvider.name.charAt(0)}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-200 mb-2">
                  Model: {settings.model}
                </h2>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Temperature: {settings.temperature} • Max Tokens: {settings.maxTokens} • Top P: {settings.topP}</p>
                  <p className="text-gray-500">
                    {getModelDescription(selectedProvider.id, settings.model)}
                  </p>
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {getModelCapabilities(selectedProvider.id).map((capability, index) => (
                  <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="text-gray-400 mb-2">{capability.icon}</div>
                    <h3 className="font-semibold text-gray-200 mb-1">{capability.title}</h3>
                    <p className="text-sm text-gray-400">{capability.description}</p>
                  </div>
                ))}
              </div>

              {/* Quick Start Message */}
              <p className="text-gray-400 text-lg">
                Describe your idea below to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 max-w-none">
            {messages.map((message) => (
                <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Message Content */}
                <div
                  className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'max-w-3xl bg-gray-600 text-white'
                      : 'max-w-5xl bg-message-assistant border border-gray-700 flex-1'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-xs opacity-70 mt-2 flex items-center justify-between">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.isStreaming && (
                      <span className="text-gray-400 text-xs">Thinking...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            

            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`${messages.length === 0 ? 'p-8' : 'border-t border-gray-700 p-4 bg-sidebar-bg'}`}>
        <form onSubmit={handleSubmit} className={`${messages.length === 0 ? 'max-w-4xl mx-auto' : ''} flex items-end gap-3`}>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={messages.length === 0 ? "Describe your idea" : "Type your message here... (Press Enter to send, Shift+Enter for new line)"}
              className={`w-full p-4 ${messages.length === 0 ? 'pr-16 text-lg' : 'pr-12'} bg-message-user border border-gray-600 rounded-xl resize-none focus:outline-none focus:border-gray-500 transition-colors scrollbar-thin`}
              style={{ minHeight: messages.length === 0 ? '60px' : '44px', maxHeight: '200px' }}
              disabled={isGenerating}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={`${messages.length === 0 ? 'p-4' : 'p-3'} bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors`}
          >
            {isGenerating ? (
              <Loader2 className={`${messages.length === 0 ? 'w-6 h-6' : 'w-5 h-5'} animate-spin`} />
            ) : (
              <Send className={`${messages.length === 0 ? 'w-6 h-6' : 'w-5 h-5'}`} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Playground;