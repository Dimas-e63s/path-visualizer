import {CustomHeap} from '@datastructures-js/heap';
import {Node} from '../models/Node.class';
import {GridRow, Grid, GridSize} from '../models/grid.types';

interface UnvisitedNodes {
  [key: string]: Node;
}

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
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function dijkstra({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}): [GridRow, GridRow] {
  const visitedNodesInOrder: GridRow = [];
  startNode.distance = 0;
  const unvisitedNodes = getNodesCopy(grid);
  const {totalRow, totalCol} = Utils.getGridSize(grid);

  while (unvisitedNodes.length > 0) {
    // debugger
    sortNodesByDistance(unvisitedNodes);
    // debugger
    const closestNode = unvisitedNodes.shift();

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
        grid: grid,
        totalCol,
        totalRow,
      });
  }
  debugger
  const res = Utils.getNodesInShortestPathOrder({
    startNode,
    finishNode: endNode,
    grid: unvisitedNodes,
  });

  return [visitedNodesInOrder, res];
}
