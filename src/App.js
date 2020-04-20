import React, { useEffect, useState } from 'react';

import HashTable from './Components/hash-table';
import TreeNode from './DataStructures/TreeNode';
import huffmanCode from './Compression-Algorithms/huffman-code';

import './Common/fonts.css'
import './Common/forms.css'
import BinaryTree from './Components/binary-tree';

function App() {

  const [text, setText] = useState("Lorem ipsum");
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
      <HashTable data={hashTable} />
      <BinaryTree treeNode={treeNode} />
    </div>
  );
}


export default App;
