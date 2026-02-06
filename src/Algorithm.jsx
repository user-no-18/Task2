import React, { useEffect, useState } from 'react';

const Algorithm = ({ traversalType, currentStep, currentNode, currentStepInfo }) => {
  const [currentReasoning, setCurrentReasoning] = useState('');
  const [visitedSequence, setVisitedSequence] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Reset when traversal changes
  useEffect(() => {
    setCurrentReasoning('');
    setVisitedSequence([]);
  }, [traversalType]);

  // Build human-readable messages for each animation step
  useEffect(() => {
    if (!currentStepInfo) {
      setCurrentReasoning('');
      return;
    }

    const { value, algorithmStep, phase, edgeTo, parent } = currentStepInfo;

    if (value === null) {
      setCurrentReasoning(`Null check encountered — returning (no node).`);
      return;
    }

    if (phase === 'visit') {
      const visitMsg = `Visit vertex with value ${value}.`;
      setVisitedSequence(prevSeq => {
        const next = [...prevSeq, value];
        const completeMsg = `${capitalize(traversalType)} traversal of ${value} is complete.`;
        setCurrentReasoning(`${visitMsg}\nVisitation sequence: ${next.join(', ')}\n${completeMsg}`);
        return next;
      });
      return;
    }

    if (phase === 'left') {
      if (edgeTo) {
        setCurrentReasoning(`Traverse left from ${value} → ${edgeTo}.`);
      } else {
        setCurrentReasoning(`Returned from left of ${value}.`);
      }
      return;
    }

    if (phase === 'right') {
      if (edgeTo) {
        setCurrentReasoning(`Traverse right from ${value} → ${edgeTo}.`);
      } else {
        setCurrentReasoning(`Returned from right of ${value}.`);
      }
      return;
    }

    // Fallback for any other step
    setCurrentReasoning(`Step ${algorithmStep} at node ${value}.`);
  }, [currentStepInfo, traversalType]);

  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Algorithm definitions for each traversal type
  const algorithms = {
    inorder: {
      title: 'In-Order Traversal',
      description: 'Left → Root → Right',
      steps: [
        { code: 'function inorder(node):', highlight: 0 },
        { code: '  if node == null:', highlight: 1 },
        { code: '    return', highlight: 2 },
        { code: '  ', highlight: -1 },
        { code: '  inorder(node.left)     // Traverse left', highlight: 3 },
        { code: '  visit(node)            // Visit root', highlight: 4 },
        { code: '  inorder(node.right)    // Traverse right', highlight: 5 },
      ],
      getHighlight: (step, node) => {
        if (!node) return 1; // null check
        if (step === 'left') return 4;
        if (step === 'visit') return 5;
        if (step === 'right') return 6;
        return 0;
      }
    },
    preorder: {
      title: 'Pre-Order Traversal',
      description: 'Root → Left → Right',
      steps: [
        { code: 'function preorder(node):', highlight: 0 },
        { code: '  if node == null:', highlight: 1 },
        { code: '    return', highlight: 2 },
        { code: '  ', highlight: -1 },
        { code: '  visit(node)            // Visit root', highlight: 3 },
        { code: '  preorder(node.left)    // Traverse left', highlight: 4 },
        { code: '  preorder(node.right)   // Traverse right', highlight: 5 },
      ],
      getHighlight: (step, node) => {
        if (!node) return 1;
        if (step === 'visit') return 4;
        if (step === 'left') return 5;
        if (step === 'right') return 6;
        return 0;
      }
    },
    postorder: {
      title: 'Post-Order Traversal',
      description: 'Left → Right → Root',
      steps: [
        { code: 'function postorder(node):', highlight: 0 },
        { code: '  if node == null:', highlight: 1 },
        { code: '    return', highlight: 2 },
        { code: '  ', highlight: -1 },
        { code: '  postorder(node.left)   // Traverse left', highlight: 3 },
        { code: '  postorder(node.right)  // Traverse right', highlight: 4 },
        { code: '  visit(node)            // Visit root', highlight: 5 },
      ],
      getHighlight: (step, node) => {
        if (!node) return 1;
        if (step === 'left') return 4;
        if (step === 'right') return 5;
        if (step === 'visit') return 6;
        return 0;
      }
    }
  };

  if (!traversalType) {
    return (
      <div className="fixed right-4 top-20 bg-white shadow-lg rounded-lg p-4 w-96 transition-all duration-300">
        <h3 className="text-xl font-bold mb-3 text-gray-800">Algorithm View</h3>
        <p className="text-gray-500 text-center py-8">
          Select a traversal method to view the algorithm
        </p>
      </div>
    );
  }

  const algorithm = algorithms[traversalType];
  const highlightIndex = currentStep !== null ? currentStep : -1;
  const containerClass = `fixed right-4 top-20 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out z-40 ${
    isMinimized ? 'p-3 w-14' : 'p-6 w-96 max-h-[600px] overflow-y-auto'
  }`;

  return (
    <div className={containerClass}>
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{isMinimized ? '≡' : algorithm.title}</h3>
          {!isMinimized && <p className="text-sm text-gray-600 mt-1">{algorithm.description}</p>}
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="ml-2 p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-gray-800"
          title={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? '▶' : '◀'}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Content below is only shown when not minimized */}

      {/* Reasoning / Step-by-step explanation */}
      <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Step Reasoning</h4>
        {!currentReasoning ? (
          <p className="text-xs text-gray-600">Steps will appear here as traversal runs.</p>
        ) : (
          <div className="text-sm text-gray-700 space-y-1">
            {currentReasoning.split('\n').map((line, i) => (
              <p key={i} className="leading-tight">{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Algorithm Code */}
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
        {algorithm.steps.map((step, index) => {
          const isHighlighted = index === highlightIndex;
          const isEmptyLine = step.highlight === -1;
          
          return (
            <div
              key={index}
              className={`py-1 px-2 rounded transition-all duration-300 ${
                isHighlighted 
                  ? 'bg-yellow-500 text-gray-900 font-bold shadow-lg scale-105' 
                  : isEmptyLine
                  ? ''
                  : 'text-gray-300'
              }`}
            >
              <code className={isHighlighted ? 'text-gray-900' : ''}>
                {step.code}
              </code>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Current Step</span>
          </div>
        </div>
        {visitedSequence.length > 0 && (
          <div className="mt-2 text-xs text-gray-700">
            <strong>Full Visitation Sequence:</strong> {visitedSequence.join(', ')}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default Algorithm;