import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import TreeVisualizer from './TreeVisualizer';
import Algorithm from './Algorithm';
import BST from './BST';

const App = () => {
  const [bst] = useState(() => {
    const tree = new BST();
    // Create default BST with initial values
    const defaultValues = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 65];
    defaultValues.forEach(val => tree.insert(val));
    return tree;
  });
  const [treeStructure, setTreeStructure] = useState(() => {
    const tree = new BST();
    const defaultValues = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 65];
    defaultValues.forEach(val => tree.insert(val));
    return tree.getTreeStructure();
  });
  const [traversalResult, setTraversalResult] = useState('');
  const [message, setMessage] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTraversalType, setCurrentTraversalType] = useState(null);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [animatingEdges, setAnimatingEdges] = useState([]);
  const [currentStepInfo, setCurrentStepInfo] = useState(null);
  
  // New state for playback controls
  const [isPaused, setIsPaused] = useState(false);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const animationTimeoutRef = useRef(null);
  const isPausedRef = useRef(false);

  // Keep isPausedRef in sync with isPaused state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const updateTree = () => {
    setTreeStructure(bst.getTreeStructure());
  };

  const handleInsert = (value) => {
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    const result = bst.insert(value);
    if (result === undefined) {
      setMessage(`Value ${value} already exists in the tree`);
    } else {
      setMessage(`Inserted ${value} successfully`);
      updateTree();
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemove = (value) => {
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    bst.remove(value);
    setMessage(`Removed ${value} from the tree`);
    updateTree();
    
    setTimeout(() => setMessage(''), 3000);
  };

  // Find parent of a node in the tree
  const findParent = (root, targetValue, parent = null) => {
    if (!root) return null;
    if (root.value === targetValue) return parent;
    
    const leftResult = findParent(root.left, targetValue, root.value);
    if (leftResult !== null) return leftResult;
    
    return findParent(root.right, targetValue, root.value);
  };

  const handleTraverse = async (type) => {
    if (isAnimating) return; // Prevent multiple animations at once
    
    setIsAnimating(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setHighlightedNodes([]);
    setAnimatingEdges([]);
    setCurrentTraversalType(type);
    setCurrentAlgorithmStep(0);
    setCurrentStepIndex(0);
    
    // Collect all animation steps
    const steps = collectTraversalSteps(bst.root, type);
    setAnimationSteps(steps);
    
    // Start animation
    animateFromStep(0, steps);
  };

  // Collect all traversal steps upfront
  const collectTraversalSteps = (node, type) => {
    const steps = [];
    
    const collectSteps = (node, type, parent = null) => {
      if (!node) {
        steps.push({ value: null, algorithmStep: 1, parent });
        return;
      }
      
      if (type === 'preorder') {
        steps.push({ value: node.value, algorithmStep: 4, phase: 'visit', parent });
        collectSteps(node.left, type, node.value);
        if (node.left) steps.push({ value: node.value, algorithmStep: 5, phase: 'left', edgeTo: node.left.value });
        collectSteps(node.right, type, node.value);
        if (node.right) steps.push({ value: node.value, algorithmStep: 6, phase: 'right', edgeTo: node.right.value });
      } else if (type === 'inorder') {
        collectSteps(node.left, type, node.value);
        if (node.left) steps.push({ value: node.value, algorithmStep: 4, phase: 'left', edgeTo: node.left.value });
        steps.push({ value: node.value, algorithmStep: 5, phase: 'visit', parent });
        collectSteps(node.right, type, node.value);
        if (node.right) steps.push({ value: node.value, algorithmStep: 6, phase: 'right', edgeTo: node.right.value });
      } else if (type === 'postorder') {
        collectSteps(node.left, type, node.value);
        if (node.left) steps.push({ value: node.value, algorithmStep: 4, phase: 'left', edgeTo: node.left.value });
        collectSteps(node.right, type, node.value);
        if (node.right) steps.push({ value: node.value, algorithmStep: 5, phase: 'right', edgeTo: node.right.value });
        steps.push({ value: node.value, algorithmStep: 6, phase: 'visit', parent });
      }
    };
    
    collectSteps(node, type);
    return steps;
  };

  // Apply a specific step
  const applyStep = (stepIndex, steps) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    const step = steps[stepIndex];
    setCurrentStepInfo(step || null);
    
    if (step.value !== null) {
      setCurrentNode(step.value);
      setCurrentAlgorithmStep(step.algorithmStep);
      
      // Update animating edges - show edge being traversed
      if (step.edgeTo) {
        setAnimatingEdges([{ from: step.value, to: step.edgeTo }]);
      } else if (step.parent !== null && step.parent !== undefined) {
        // Show edge from parent to current node when visiting
        setAnimatingEdges([{ from: step.parent, to: step.value }]);
      } else {
        setAnimatingEdges([]);
      }
      
      // Update highlighted nodes based on all visited nodes up to this point
      const visitedNodes = steps
        .slice(0, stepIndex + 1)
        .filter(s => s.phase === 'visit' && s.value !== null)
        .map(s => s.value);
      setHighlightedNodes(visitedNodes);
      
      // Update traversal result
      const path = visitedNodes.join(', ');
      setTraversalResult(`${currentTraversalType.toUpperCase()}: [${path}]`);
    } else {
      setCurrentAlgorithmStep(1);
      setAnimatingEdges([]);
    }
    
    setCurrentStepIndex(stepIndex);
  };

  // Animate from a specific step
  const animateFromStep = (startIndex, steps) => {
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const animate = (index) => {
      // Check if animation is complete
      if (index >= steps.length) {
        // Animation complete
        setIsAnimating(false);
        setAnimatingEdges([]);
        setCurrentStepInfo(null);
        setTimeout(() => {
          setHighlightedNodes([]);
          setTraversalResult('');
          setCurrentTraversalType(null);
          setCurrentAlgorithmStep(null);
          setCurrentNode(null);
          setAnimationSteps([]);
          setCurrentStepIndex(0);
        }, 3000);
        return;
      }

      // Apply current step
      applyStep(index, steps);

      // Schedule next step - use ref to get current pause state
      animationTimeoutRef.current = setTimeout(() => {
        if (!isPausedRef.current) {
          animate(index + 1);
        }
      }, 800);
    };

    animate(startIndex);
  };

  // Playback control handlers
  const handlePause = () => {
    if (isPaused) {
      // Resume animation
      setIsPaused(false);
      isPausedRef.current = false;
      // Continue from the next step
      animateFromStep(currentStepIndex + 1, animationSteps);
    } else {
      // Pause animation
      setIsPaused(true);
      isPausedRef.current = true;
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < animationSteps.length - 1) {
      // Clear any running animation
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Pause the animation if it's running
      if (!isPaused) {
        setIsPaused(true);
        isPausedRef.current = true;
      }
      
      // Move to next step
      const newIndex = currentStepIndex + 1;
      applyStep(newIndex, animationSteps);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      // Clear any running animation
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Pause the animation if it's running
      if (!isPaused) {
        setIsPaused(true);
        isPausedRef.current = true;
      }
      
      // Move to previous step
      const newIndex = currentStepIndex - 1;
      applyStep(newIndex, animationSteps);
    }
  };

  const handleStop = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setIsAnimating(false);
    setIsPaused(false);
    isPausedRef.current = false;
    setHighlightedNodes([]);
    setTraversalResult('');
    setCurrentTraversalType(null);
    setCurrentAlgorithmStep(null);
    setCurrentNode(null);
    setCurrentStepInfo(null);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setAnimatingEdges([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Binary Search Tree Visualizer
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Interactive BST with Insert, Remove, and Traversal Operations
        </p>
      </header>

      {/* Controls */}
      <Button 
        onInsert={handleInsert}
        onRemove={handleRemove}
        onTraverse={handleTraverse}
      />

      {/* Algorithm Visualization */}
      <Algorithm 
        traversalType={currentTraversalType}
        currentStep={currentAlgorithmStep}
        currentNode={currentNode}
        currentStepInfo={currentStepInfo}
      />

      {/* Messages */}
      {message && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {/* Traversal Result */}
      {traversalResult && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-8 py-4 rounded-lg shadow-lg z-50 font-mono text-lg">
          {traversalResult}
        </div>
      )}

      {/* Playback Controls - Only shown during traversal */}
      {isAnimating && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-lg p-4 z-50 flex items-center gap-3">
          {/* Step Backward */}
          <button
            onClick={handleStepBackward}
            disabled={currentStepIndex === 0}
            className={`p-3 rounded-lg font-semibold transition-all ${
              currentStepIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            }`}
            title="Step Backward"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          {/* Pause/Play */}
          <button
            onClick={handlePause}
            className="p-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all active:scale-95"
            title={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={handleStepForward}
            disabled={currentStepIndex >= animationSteps.length - 1}
            className={`p-3 rounded-lg font-semibold transition-all ${
              currentStepIndex >= animationSteps.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            }`}
            title="Step Forward"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>

          {/* Stop Button */}
          <button
            onClick={handleStop}
            className="p-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all active:scale-95 ml-2"
            title="Stop"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>

          {/* Progress Indicator */}
          <div className="ml-3 text-sm font-semibold text-gray-700">
            Step {currentStepIndex + 1} / {animationSteps.length}
          </div>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="pt-8">
        <TreeVisualizer 
          root={treeStructure} 
          highlightedNodes={highlightedNodes}
          currentNode={currentNode}
          animatingEdges={animatingEdges}
        />
      </div>
    </div>
  );
};

export default App;