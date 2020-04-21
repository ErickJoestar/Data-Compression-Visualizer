class TreeNode {
  constructor(key = null, value = null, parent = this) {
    this.key = key;
    this.value = value;
    this.left = undefined;
    this.right = undefined;
    this.parent = parent;
  }

  setLeft(node) {
    this.left = node;
    return this;
  }
  setRight(node) {
    this.right = node;
    return this;
  }

  setParent(node) {
    this.parent = node;
    return this;
  }

  setKey(key) {
    this.key = key;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  deepFirstSearch(callback = () => null, acc = this.value) {
    const status = {
      completed: false
    }
    const stopDFS = () => status.completed = true;
    return this._deepFirstSearch(callback, acc, 0, status, stopDFS)
  }

  _deepFirstSearch(callback, acc, currentHeight, status, stopDFS) {
    if (!status.completed) {
      acc = callback(acc, this, currentHeight, stopDFS);

      if (!status.completed && this.left instanceof TreeNode) {
        acc = this.left._deepFirstSearch(callback, acc, currentHeight + 1, status, stopDFS);
      }

      if (!status.completed && this.right instanceof TreeNode) {
        acc = this.right._deepFirstSearch(callback, acc, currentHeight + 1, status, stopDFS);
      }
    }
    return acc;
  }

  breadthFirstSearch(callback = () => null, acc = this.value) {
    const status = {
      completed: false
    }
    const stopBFS = () => status.completed = true;

    const queue = [{ node: this, height: 0 }];
    while (!status.completed && queue.length > 0) {
      const { node, height } = queue.shift();
      acc = callback(acc, node, height, stopBFS);
      if (node.left instanceof TreeNode) {
        queue.push({ node: node.left, height: height + 1 });
      }
      if (node.right instanceof TreeNode) {
        queue.push({ node: node.right, height: height + 1 });
      }
    }
    return acc;
  }

  getPath(key = 0) {
    const generatePath = (acc, node, height, stop) => {
      const history = acc.slice(0, height);
      history.push(node.key);
      if (node.key === key)
        stop();
      return history;
    }
    return this.deepFirstSearch(generatePath, []);
  }

  getHeight() {
    const heightFunction = (acc, node, height) => {
      return Math.max(height, acc);
    }
    return this.deepFirstSearch(heightFunction, 0);
  }
}

export default TreeNode;