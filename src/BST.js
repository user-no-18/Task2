// Binary Search Tree Node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Binary Search Tree Class
class BST {
  constructor() {
    this.root = null;
  }

  // Insert a node
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (this.root === null) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // Duplicate values not allowed
      
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Remove a node
  remove(value) {
    this.root = this.removeNode(this.root, value);
    return this;
  }

  removeNode(node, value) {
    if (node === null) return null;

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    } else {
      // Node to delete found
      
      // Case 1: Node has no children (leaf node)
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: Node has one child
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      // Case 3: Node has two children
      // Find the minimum value in the right subtree
      let minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.right = this.removeNode(node.right, minRight.value);
      return node;
    }
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  //TRAVERSAL METHODS

  // In-Order Traversal (Left, Root, Right)
  inorder(node = this.root, result = []) {
    if (node !== null) {
      this.inorder(node.left, result);
      result.push(node.value);
      this.inorder(node.right, result);
    }
    return result;
  }

  // Pre-Order Traversal (Root, Left, Right)
  preorder(node = this.root, result = []) {
    if (node !== null) {
      result.push(node.value);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
    }
    return result;
  }

  // Post-Order Traversal (Left, Right, Root)
  postorder(node = this.root, result = []) {
    if (node !== null) {
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  // Get tree structure for visualization
  getTreeStructure() {
    return this.root;
  }
}

export default BST;