import React, { useState } from 'react';

const Button = ({ onInsert, onRemove, onTraverse, visible = true }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [traversalType, setTraversalType] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const handleMenuToggle = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
    setInputValue('');
    setTraversalType('');
  };

  const handleGo = () => {
    if (activeMenu === 'insert' && inputValue.trim()) {
      onInsert(parseInt(inputValue));
      setInputValue('');
    } else if (activeMenu === 'remove' && inputValue.trim()) {
      onRemove(parseInt(inputValue));
      setInputValue('');
    }
  };

  const handleTraversal = (type) => {
    setTraversalType(type);
    onTraverse(type);
  };

  const containerClass = `fixed left-4 top-20 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out z-40 ${
    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'
  } ${isMinimized ? 'p-3 w-14' : 'p-4 w-64'}`;

  return (
    <div className={containerClass}>
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{isMinimized ? '≡' : 'BST Operations'}</h3>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-gray-800"
          title={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? '▶' : '◀'}
        </button>
      </div>

      {!isMinimized && (
        <>
      
      {/* Insert Node Button */}
    
    
    
      <div className="mb-3">
        <button
          onClick={() => handleMenuToggle('insert')}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeMenu === 'insert'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Insert Node
        </button>
        
        {activeMenu === 'insert' && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGo()}
            />
            <button
              onClick={handleGo}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold"
            >
              Go
            </button>
          </div>
        )}
      </div>

      {/* Remove Node Button */}
      <div className="mb-3">
        <button
          onClick={() => handleMenuToggle('remove')}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeMenu === 'remove'
              ? 'bg-red-600 text-white'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Remove Node
        </button>
        
        {activeMenu === 'remove' && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGo()}
            />
            <button
              onClick={handleGo}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold"
            >
              Go
            </button>
          </div>
        )}
      </div>

      {/* Traverse Node Button */}
      <div className="mb-3">
        <button
          onClick={() => handleMenuToggle('traverse')}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeMenu === 'traverse'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          Traverse Tree
        </button>
        
        {activeMenu === 'traverse' && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
            <button
              onClick={() => handleTraversal('inorder')}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
                traversalType === 'inorder'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              In-Order
            </button>
            <button
              onClick={() => handleTraversal('preorder')}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
                traversalType === 'preorder'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              Pre-Order
            </button>
            <button
              onClick={() => handleTraversal('postorder')}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
                traversalType === 'postorder'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              Post-Order
            </button>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default Button;