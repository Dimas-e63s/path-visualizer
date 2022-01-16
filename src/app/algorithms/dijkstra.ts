import {CustomHeap} from '@datastructures-js/heap';
import {Node} from '../models/Node.class';
import {GridRow, Grid, GridSize} from '../models/grid.types';
import {Utils} from './utils.class';

type Heap = CustomHeap<Node>;

export class Dijkstra {
  static isFirstRow(rowIdx: number): boolean {
    return rowIdx === 0;
  }

  static isLastRow(rowIdx: number, lastRowIdx: number): boolean {
    return rowIdx === lastRowIdx;
  }

  static isFirstColumn(colIdx: number): boolean {
    return colIdx === 0;
  }

  static isLastColumn(colIdx: number, lastColIdx: number): boolean {
    return colIdx === lastColIdx;
  }
}

function sortNodesByDistance(unvisitedNodes: any) {
  unvisitedNodes.sort((nodeA: any, nodeB: any) => nodeA.distance - nodeB.distance);
}

function getNodesCopy(grid: any): any {
  const nodes = new Map();
  for (const row of grid) {
    for (const node of row) {
      nodes.set(`${node.getRowIdx()}-${node.getColumnIdx()}`, node.clone());
    }
  }
  return nodes;
}

export function dijkstra({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}): [GridRow, GridRow] {
  const visitedNodesInOrder: GridRow = [];
  startNode.distance = 0;
  // SHARE REFERENCE
  const unvisitedNodes = getNodesCopy(grid);

  const gridCopy = [];
  for (const node of unvisitedNodes.values()) {
    gridCopy.push(node);
  }

  const startNodeId = `${startNode.getRowIdx()}-${startNode.getColumnIdx()}`;
  const endNodeId = `${endNode.getRowIdx()}-${endNode.getColumnIdx()}`

  const minHeap = new CustomHeap<Node>((a, b) => a.distance - b.distance);
  minHeap.insert(unvisitedNodes.get(startNodeId))

  const {totalRow, totalCol} = Utils.getGridSize(grid);

  while (gridCopy.length > 0) {
    sortNodesByDistance(gridCopy);
    const closestNode = gridCopy.shift();

    if (closestNode.isWall()) {
      continue;
    }

    if (closestNode.distance === Infinity) {
      break;
    }

    closestNode.setAsVisited();
    visitedNodesInOrder.push(closestNode);

    if (Utils.isEndNode(closestNode, endNode)) {
      break;
    }

    Utils.updateUnvisitedNeighbors(
      {
        node: closestNode,
        grid: unvisitedNodes,
        totalCol,
        totalRow,
      });
  }

  debugger
  const res = Utils.getNodesInShortestPathOrder({
    startNode: unvisitedNodes.get(startNodeId),
    finishNode: unvisitedNodes.get(endNodeId),
    grid: unvisitedNodes,
  });

  return [visitedNodesInOrder, res];
}
