import React, { useState } from 'react';
import { X, Settings, Zap, FileText } from 'lucide-react';
import { usePlayground } from '../context/PlaygroundContext';
import SystemInstructions from './SystemInstructions';

const Sidebar = ({ onClose }) => {
  const { 
    settings, 
    updateSettings, 
    availableProviders, 
    selectedProvider, 
    setProvider,
    systemInstructions,
    updateSystemInstructions
  } = usePlayground();

  const [isSystemInstructionsOpen, setIsSystemInstructionsOpen] = useState(false);

  const handleModelChange = (modelId) => {
    updateSettings({ model: modelId });
  };

  const handleTemperatureChange = (temperature) => {
    updateSettings({ temperature });
  };

  const handleMaxTokensChange = (maxTokens) => {
    updateSettings({ maxTokens });
  };

  const handleTopPChange = (topP) => {
    updateSettings({ topP });
  };

  return (
    <div className="h-full bg-sidebar-bg border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 relative min-h-[72px]">
        <h2 className="text-sm font-medium text-gray-300">
          Model Selection
        </h2>
        <button
          onClick={onClose}
          className="lg:hidden absolute right-4 p-1 rounded-md hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Settings Section */}
        <div className="overflow-y-auto scrollbar-thin px-4 py-6 space-y-6">
          {/* Model Selection */}
          <div>
          
          {/* AI Provider Dropdown */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              AI Provider
            </label>
            <select
              value={settings.provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 transition-colors text-white"
            >
              {availableProviders.map((provider) => (
                <option key={provider.id} value={provider.id} className="bg-gray-800">
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Dropdown */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 transition-colors text-white"
            >
              {selectedProvider.models.map((model) => (
                <option key={model} value={model} className="bg-gray-800">
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parameters */}
        <div>
          <h2 className="text-sm font-medium text-gray-300 mb-3">Parameters</h2>
          
          {/* Temperature */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Max Tokens: {settings.maxTokens}
            </label>
            <input
              type="range"
              min="1"
              max="4096"
              step="1"
              value={settings.maxTokens}
              onChange={(e) => handleMaxTokensChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Top P */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Top P: {settings.topP}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.topP}
              onChange={(e) => handleTopPChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          </div>
        </div>



        {/* Actions */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setIsSystemInstructionsOpen(true)}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={16} />
            System Instructions
          </button>
        </div>
      </div>

      {/* System Instructions Modal */}
      <SystemInstructions
        isOpen={isSystemInstructionsOpen}
        onClose={() => setIsSystemInstructionsOpen(false)}
        onSave={updateSystemInstructions}
        initialInstructions={systemInstructions}
      />
    </div>
  );
};

export default Sidebar;