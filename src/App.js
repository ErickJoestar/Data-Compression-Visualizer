import React, { useEffect, useState } from 'react';

import HashTable from './Components/hash-table';
import TreeNode from './DataStructures/TreeNode';
import huffmanCode from './Compression-Algorithms/huffman-code';

import './Common/fonts.css'
import './Common/forms.css'
import BinaryTree from './Components/binary-tree';

function App() {

  const [text, setText] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
  const [hashTable, setHashTable] = useState([]);
  const [treeNode, setTreeNode] = useState(new TreeNode("vertex", 0));

  useEffect(() => {
    const data = huffmanCode(text);
    setHashTable(data.hashTable);
    setTreeNode(data.root);
  }, [text])

  return (
    <div className="main">
      {/* <CodeSnippet /> */}
      <textarea className="textarea" spellCheck="false" value={text} onChange={e => setText(e.target.value)} />
      <BinaryTree treeNode={treeNode} />
      <HashTable data={hashTable} />
    </div>
  );
}


export default App;
