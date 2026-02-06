# Binary Search Tree Visualizer

This project demonstrates **insertion, deletion, and traversal** (inorder, preorder, postorder) of a Binary Search Tree.

Traversal is visualized step by step, showing:
- the current algorithm step in real time  
- reasoning behind each step (e.g., *“Postorder traversal of 10 is complete”*)

The app includes **pause, reset, forward, and backward** controls.  
⚠️ Click the **pause button twice** to start the animation.

## Structure
- **BST.js**: implements the core BST logic and operations  
- **TreeVisualizer**: renders the tree in the UI  
- **Algorithm**: shows the algorithm and explains what step is happening  
- **Button**: handles all animation controls

## Future Scope
- Use a global AppContext to manage animation state (or improve pause logic without it)
- Add a speed control slider (currently using an 800ms delay)
