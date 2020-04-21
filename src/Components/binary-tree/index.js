import React, { useState, useEffect, useRef } from 'react'
import TreeNode from '../../DataStructures/TreeNode'
import *  as d3 from 'd3';

import '../../Common/containers.css'
import '../../Common/colors.css';
import './style.css'

const NODE_RADIUS = 15;
const NODE_MARGIN = 20;
const WIDTH = 900;

const BinaryTree = ({ treeNode }) => {
  const [vertexArr, setVertexArr] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodesData, setNodesData] = useState({});
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: WIDTH,
    treeHeight: 0,
    treeWidth: 0,
    paddingTopBottom: 50,
    paddingLeftRight: 20,
    nodeRadius: 32
  });
  const ref = useRef(null);

  useEffect(() => {
    const nodes = {};
    const getNodesData = (node, height) => {
      let width = 0;
      if (node.left instanceof TreeNode) {
        width += getNodesData(node.left, height + 1);
      }
      if (node.right instanceof TreeNode) {
        width += getNodesData(node.right, height + 1);
      }
      width = Math.max(1, width);
      nodes[node.key] = {
        value: node.value,
        key: node.key,
        width: width,
        height: height,
        left: node.left,
        right: node.right
      };
      return width;
    }
    getNodesData(treeNode, 0);
    setNodesData(nodes);
    const nodeHeight = treeNode.getHeight();
    const nodeWidth = nodes[treeNode.key].width;
    const nodeRadius = NODE_RADIUS;
    setDimensions(d => (
      {
        ...d,
        treeHeight: nodeHeight,
        treeWidth: nodeWidth,
        nodeRadius: nodeRadius,
        height: (NODE_RADIUS + NODE_MARGIN) * nodeHeight * 2 + d.paddingTopBottom * 2
      }));

  }, [treeNode])

  useEffect(() => {
    const { paddingLeftRight, paddingTopBottom, width, height, treeHeight } = dimensions;
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([paddingLeftRight, width - paddingLeftRight]);
    const yScale = d3
      .scaleLinear()
      .domain([treeHeight, 0])
      .range([height - paddingTopBottom, paddingTopBottom]);
    const lineGenerator = d3.line();
    /// Get value from 0 to 1 representing the x position
    const edgesArr = [];
    const vertex = { ...nodesData };
    const getAbsolutePos = (node, start, end, parentPos = []) => {
      if (node === undefined) return;
      vertex[node.key].x = (start + end) / 2;
      const { left, right } = node;
      const hasLeft = left instanceof TreeNode;
      const hasRight = right instanceof TreeNode;
      const { treeWidth } = dimensions;
      const pos = [vertex[node.key].x, vertex[node.key].height];

      if (parentPos.length > 0) {
        edgesArr.push([parentPos, pos])
      }
      if (hasLeft && hasRight) {
        getAbsolutePos(left, start, start + vertex[left.key].width / treeWidth, pos)
        getAbsolutePos(right, start + vertex[left.key].width / treeWidth, end, pos)
      } else if (hasLeft) {
        getAbsolutePos(left, start, end, pos)
      } else if (hasRight) {
        getAbsolutePos(right, start, end, pos)
      }
    }
    console.log(edgesArr);

    getAbsolutePos(vertex[treeNode.key], 0, 1);
    /// Maping the values with d3

    const vertexArr = [];
    for (const key in vertex) {
      vertex[key].x = xScale(vertex[key].x);
      vertex[key].y = yScale(vertex[key].height);
      vertexArr.push(vertex[key]);
    }
    const edges = [];
    for (const points of edgesArr) {
      const from = [xScale(points[0][0]), yScale(points[0][1])];
      const to = [xScale(points[1][0]), yScale(points[1][1])];
      edges.push(lineGenerator([from, to]));
    }
    console.log(edges);
    setEdges(edges);
    setVertexArr(vertexArr);

  }, [nodesData, dimensions, treeNode])

  return <div className="structure-container tree_container" style={{ width: WIDTH }}>
    <svg width={dimensions.width} height={dimensions.height}>
      <g ref={ref}>
        {edges.map((e, i) => <path className='fill-white tree_edge' key={i} d={e} strokeWidth={2} />)}
        {vertexArr.map((v, i) => <circle className='tree_node' key={i} cx={v.x} cy={v.y} fill={v.fill} r={NODE_RADIUS} />)}
      </g>
    </svg>
  </div>
}

export default BinaryTree;