import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const SystemInstructions = ({
  isOpen,
  onClose,
  onSave,
  initialInstructions
}) => {
  const [instructions, setInstructions] = useState(initialInstructions);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setInstructions(initialInstructions);
  }, [initialInstructions]);

  const addNewInstruction = () => {
    const newInstruction = {
      id: Date.now().toString(),
      title: '',
      content: ''
    };
    setInstructions([...instructions, newInstruction]);
    setExpandedId(newInstruction.id);
  };

  const updateInstruction = (id, field, value) => {
    setInstructions(instructions.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const deleteInstruction = (id) => {
    setInstructions(instructions.filter(inst => inst.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleSave = () => {
    onSave(instructions);
    onClose();
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">System Instructions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create new instruction */}
          <div className="mb-6">
            <button
              onClick={addNewInstruction}
              className="flex items-center gap-2 w-full p-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-gray-300 hover:text-white"
            >
              <Plus size={20} />
              Create new instruction
            </button>
          </div>

          {/* Instructions list */}
          <div className="space-y-4">
            {instructions.map((instruction) => (
              <div key={instruction.id} className="border border-gray-600 rounded-lg">
                {/* Instruction header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => toggleExpanded(instruction.id)}
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={instruction.title}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateInstruction(instruction.id, 'title', e.target.value);
                      }}
                      placeholder="Title"
                      className="bg-transparent text-white placeholder-gray-400 border-none outline-none w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteInstruction(instruction.id);
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Expanded content */}
                {expandedId === instruction.id && (
                  <div className="p-4 border-t border-gray-600">
                    <textarea
                      value={instruction.content}
                      onChange={(e) => updateInstruction(instruction.id, 'content', e.target.value)}
                      placeholder="Optional tone and style instructions for the model"
                      className="w-full h-40 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg p-3 resize-none focus:outline-none focus:border-gray-500 transition-colors"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info text */}
          <p className="text-sm text-gray-400 mt-6">
            Instructions are saved in local storage.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemInstructions;