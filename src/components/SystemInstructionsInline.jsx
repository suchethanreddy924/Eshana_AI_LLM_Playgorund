import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { usePlayground } from '../context/PlaygroundContext';

const SystemInstructionsInline = () => {
  const { systemInstructions, updateSystemInstructions } = usePlayground();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localInstructions, setLocalInstructions] = useState(systemInstructions);

  const handleSave = () => {
    updateSystemInstructions(localInstructions);
  };

  const handleReset = () => {
    setLocalInstructions(systemInstructions);
  };

  const hasChanges = localInstructions !== systemInstructions;

  return (
    <div className="border-t border-gray-700">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">System Instructions</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-3">
            <textarea
              value={localInstructions}
              onChange={(e) => setLocalInstructions(e.target.value)}
              placeholder="Enter system instructions to guide the AI's behavior..."
              className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            
            {hasChanges && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
            
            <div className="text-xs text-gray-400">
              <p>System instructions help guide the AI's responses and behavior throughout the conversation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemInstructionsInline;