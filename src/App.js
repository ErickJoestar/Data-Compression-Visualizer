import React, { useEffect } from 'react';

import TreeNode from './DataStructures/TreeNode';
import CodeSnippet from './Components/code-snippet';

import HashTable from './Components/hash-table';

const DATA = [{ key: 'a', value: 30 }, { key: 'e', value: 26 }, { key: '😁', value: 20 }, { key: 'a', value: 30 }, { key: 'e', value: 26 }, { key: 'm', value: 20 }, { key: 'a', value: 30 }, { key: 'e', value: 26 }, { key: 'm', value: 20 }, { key: 'a', value: 30 }, { key: 'e', value: 26 }, { key: 'm', value: 20 }]

function App() {


  // Testing TreeNode :)

  // useEffect(() => {
  //   const root = new TreeNode(0, 0);
  //   root.setLeft(new TreeNode(1, 1)).setRight(new TreeNode(2, 2));
  //   root.left.setLeft(new TreeNode(3, 3).setLeft(new TreeNode(4, 4)));

  //   root.deepFirstSearch((acc, node, height, stop) => {
  //     acc = acc + node.value;
  //     console.log(node.key, node.value)
  //     if (acc >= 4) stop();
  //     return acc;
  //   }, 0)
  // }, []);

  return (
    <div className="root">
      {/* <CodeSnippet /> */}
      <HashTable data={DATA} />
    </div>
  );
}


export default App;
