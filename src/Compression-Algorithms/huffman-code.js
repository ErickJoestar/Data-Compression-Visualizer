import TreeNode from '../DataStructures/TreeNode';
import PriorityQueue from 'js-priority-queue';

const huffmanCode = (text) => {
  let hashTable = new Map();
  Array.from(text).forEach(char => {
    if (hashTable.has(char)) {
      hashTable.set(char, hashTable.get(char) + 1)
    } else {
      hashTable.set(char, 1);
    }
  })


  const hashTableArray = [];
  const priorityQueue = new PriorityQueue({ comparator: (a, b) => a.value - b.value });

  let mapIter = hashTable.entries();
  for (let i = 0; i < hashTable.size; i++) {
    const [key, value] = mapIter.next().value;
    hashTableArray.push({ key, value });
    priorityQueue.queue(new TreeNode(key, value))
  }
  hashTableArray.sort((a, b) => b.value - a.value);

  while (priorityQueue.length > 1) {
    const left = priorityQueue.dequeue();
    const right = priorityQueue.dequeue();
    const node = new TreeNode('vertex', left.value + right.value)
    node.setLeft(left).setRight(right);
    left.setParent(node);
    right.setParent(node);
    priorityQueue.queue(node);
  }

  return { hashTable: hashTableArray, root: priorityQueue.peek() || new TreeNode("vertex", 0) };
}

export default huffmanCode;