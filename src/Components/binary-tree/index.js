import React, { useState, useEffect, useRef } from 'react'
import TreeNode from '../../DataStructures/TreeNode'
import *  as d3 from 'd3';

import '../../Common/containers.css'
import '../../Common/colors.css';
import './style.css'

const NODE_RADIUS = 10;
const NODE_MARGIN = 10;
const WIDTH = 900;

const BinaryTree = ({ treeNode }) => {
  const [state, setState] = useState({
    dimensions: {
      height: 0, width: WIDTH, paddingTopBottom: 50, paddingLeftRight: 20, nodeRadius: 32, treeHeight: 0, treeWidth: 0
    }, edges: [], vertex: []
  });
  const ref = useRef(null);
  console.log(treeNode);

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

    const treeHeight = treeNode.getHeight();
    const treeWidth = nodes[treeNode.key].width;
    const nodeRadius = NODE_RADIUS;
    /////// DIMENSIONS
    const edges = [];

    const getAbsolutePos = (node, start, end, parentPos = []) => {
      if (node === undefined) return;
      nodes[node.key].x = (start + end) / 2;
      const { left, right } = node;
      const hasLeft = left instanceof TreeNode;
      const hasRight = right instanceof TreeNode;
      const pos = [nodes[node.key].x, nodes[node.key].height];

      if (parentPos.length > 0) {
        edges.push({ from: parentPos, to: pos, key: node.key })
      }
      if (hasLeft && hasRight) {
        getAbsolutePos(left, start, start + nodes[left.key].width / treeWidth, pos)
        getAbsolutePos(right, start + nodes[left.key].width / treeWidth, end, pos)
      } else if (hasLeft) {
        getAbsolutePos(left, start, end, pos)
      } else if (hasRight) {
        getAbsolutePos(right, start, end, pos)
      }
    }

    getAbsolutePos(nodes[treeNode.key], 0, 1);
    /// Maping the values with d3

    const vertex = [];
    for (const key in nodes) {
      vertex.push(nodes[key]);
    }

    setState(s => {
      const height = (NODE_RADIUS + NODE_MARGIN) * treeHeight * 2 + s.dimensions.paddingTopBottom * 2

      const dimensions = {
        ...s.dimensions,
        treeHeight: treeHeight,
        treeWidth: treeWidth,
        nodeRadius: nodeRadius,
        height: height
      }
      return { dimensions, edges, vertex }
    });
  }, [treeNode])


  useEffect(() => {
    const { dimensions, vertex, edges } = state;
    const svgContainer = d3.select(ref.current);
    const svgCircles = svgContainer.selectAll('circle');
    const svgPaths = svgContainer.selectAll('path');
    let edgesArr = [];

    let path = [];
    /// Scales 
    let xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([dimensions.paddingLeftRight, dimensions.width - dimensions.paddingLeftRight]);
    let yScale = d3
      .scaleLinear()
      .domain([dimensions.treeHeight, 0])
      .range([dimensions.height - dimensions.paddingTopBottom, dimensions.paddingTopBottom]);

    // Generaton the edges

    /// Update the positions baes on the zoom
    const updateElementsPosition = () => {
      const lineGenerator = d3.line();

      edgesArr = edges.map(edge => {
        const from = [xScale(edge.from[0]), yScale(edge.from[1])];
        const to = [xScale(edge.to[0]), yScale(edge.to[1])];
        return ({ path: lineGenerator([from, to]), key: edge.key });
      })

      svgCircles
        .data(vertex)
        .attr('cx', v => xScale(v.x))
        .attr('cy', v => yScale(v.height))
        .attr('class', v => path.includes(v.key) ? 'tree_node selected' : 'tree_node')
        .on('click', handleMouseClick)

      svgPaths
        .data(edgesArr)
        .attr('d', e => e.path)
        .attr('stroke', e => path.includes(e.key) ? '#f5d67b' : '#b3aca7')

    }

    /// Handling zoom 
    const handleZoom = () => {
      const zoomTransform = d3.event.transform;
      console.log(d3.event);
      xScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([dimensions.paddingLeftRight, dimensions.width - dimensions.paddingLeftRight]);
      yScale = d3
        .scaleLinear()
        .domain([dimensions.treeHeight, 0])
        .range([dimensions.height - dimensions.paddingTopBottom, dimensions.paddingTopBottom]);

      if (zoomTransform) {
        xScale.domain(zoomTransform.rescaleX(xScale).domain());
        yScale.domain(zoomTransform.rescaleY(yScale).domain());
        ref.current.style.transform = `scale(${Math.min(1, zoomTransform.k)})`
      }
      updateElementsPosition();
    }

    svgContainer
      .call(d3.zoom()
        .scaleExtent([1, 50])
        .translateExtent([[-100, -100], [dimensions.width, dimensions.height]])
        .extent([[-100, -100], [dimensions.width, dimensions.height]])
        .on("zoom", handleZoom));


    /// Handling mouse interactions

    function handleMouseClick(props) {
      path = treeNode.getPath(props.key);
      svgCircles
        .data(vertex)
        .transition()
        .attr('class', v => path.includes(v.key) ? 'tree_node selected' : 'tree_node')
      svgPaths
        .data(edgesArr)
        .attr('stroke', e => { console.log(e); return path.includes(e.key) ? '#f5d67b' : '#b3aca7' })
    }





    updateElementsPosition();
  }, [ref, state, treeNode])




  return <div className="structure-container tree_container" style={{ width: WIDTH }}>
    <svg ref={ref} width={state.dimensions.width} height={state.dimensions.height} >
      <g>
        {console.log('RENDER')}
        {state.edges.map((e, i) => <path className='fill-white tree_edge' key={i} strokeWidth={2} />)}
        {state.vertex.map((v, i) => <circle className='tree_node' key={i} r={NODE_RADIUS} />)}
      </g>
    </svg>
  </div>
}

export default BinaryTree;