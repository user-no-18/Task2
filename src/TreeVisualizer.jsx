import React from 'react';

const TreeVisualizer = ({ root, highlightedNodes = [], currentNode = null, animatingEdges = [] }) => {
  if (!root) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400 text-xl">
        Tree is empty. Insert nodes to visualize.
      </div>
    );
  }

  // Calculate positions for nodes
  const getNodePositions = (node, x = 400, y = 50, level = 0, positions = [], parent = null) => {
    if (!node) return positions;

    const horizontalSpacing = 200 / Math.pow(2, level);
    
    positions.push({
      value: node.value,
      x,
      y,
      parent,
    });

    if (node.left) {
      positions.push({
        type: 'line',
        x1: x,
        y1: y,
        x2: x - horizontalSpacing,
        y2: y + 80,
        from: node.value,
        to: node.left.value,
        direction: 'left',
      });
      getNodePositions(node.left, x - horizontalSpacing, y + 80, level + 1, positions, node.value);
    }

    if (node.right) {
      positions.push({
        type: 'line',
        x1: x,
        y1: y,
        x2: x + horizontalSpacing,
        y2: y + 80,
        from: node.value,
        to: node.right.value,
        direction: 'right',
      });
      getNodePositions(node.right, x + horizontalSpacing, y + 80, level + 1, positions, node.value);
    }

    return positions;
  };

  const positions = getNodePositions(root);
  const lines = positions.filter(p => p.type === 'line');
  const nodes = positions.filter(p => !p.type);

  // Check if a node should be highlighted
  const isHighlighted = (value) => highlightedNodes.includes(value);
  
  // Check if an edge is currently being animated
  const isEdgeAnimating = (from, to) => {
    return animatingEdges.some(edge => edge.from === from && edge.to === to);
  };
  
  // Check if an edge has been traversed (is in the completed path)
  const isEdgeTraversed = (from, to) => {
    // An edge is traversed if both nodes have been visited
    return highlightedNodes.includes(from) && highlightedNodes.includes(to);
  };

  return (
    <div className="w-full h-screen overflow-auto bg-gray-50">
      <svg width="800" height="600" className="mx-auto">
        {/* Draw lines first (so they appear behind nodes) */}
        {lines.map((line, index) => {
          const isAnimating = isEdgeAnimating(line.from, line.to);
          const isTraversed = isEdgeTraversed(line.from, line.to);
          
          // Determine the line color and style based on state
          let strokeColor = '#94a3b8'; // default gray
          let strokeWidth = '2';
          let strokeDasharray = '';
          let className = '';
          
          if (isAnimating) {
            strokeColor = '#fbbf24'; // yellow for currently animating
            strokeWidth = '4';
            className = 'animate-pulse';
          } else if (isTraversed) {
            strokeColor = '#10b981'; // green for traversed
            strokeWidth = '3';
          }
          
          return (
            <g key={`line-${index}`}>
              {/* Glow effect for animating edges */}
              {isAnimating && (
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#fbbf24"
                  strokeWidth="8"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
              
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                className={className}
                style={{ transition: 'all 0.3s ease' }}
              />
              
              {/* Arrow head for direction indication during animation */}
              {isAnimating && (
                <defs>
                  <marker
                    id={`arrowhead-${index}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#fbbf24" />
                  </marker>
                </defs>
              )}
            </g>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node, index) => {
          const highlighted = isHighlighted(node.value);
          const isCurrent = currentNode === node.value;
          
          return (
            <g key={`node-${index}`}>
              {/* Outer glow effect for highlighted nodes */}
              {highlighted && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill="#fbbf24"
                  opacity="0.4"
                  className="animate-pulse"
                />
              )}
              
              {/* Extra large glow for current node */}
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="38"
                  fill="#ef4444"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
              
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill={isCurrent ? '#ef4444' : highlighted ? '#fbbf24' : '#3b82f6'}
                stroke={isCurrent ? '#dc2626' : highlighted ? '#f59e0b' : '#1e40af'}
                strokeWidth={isCurrent || highlighted ? '3' : '2'}
                className="transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isCurrent || highlighted ? '#78350f' : 'white'}
                fontSize="16"
                fontWeight="bold"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TreeVisualizer;