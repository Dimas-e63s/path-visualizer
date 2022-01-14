//@ts-ignore
import {CustomHeap, HeapNode} from '@datastructures-js/heap';
import {Node} from '../models/Node.class';
import {GridRow, Grid} from '../models/grid.types';

interface UnvisitedNodes {
  [key: string]: Node
}

type Heap = CustomHeap<Node>;

class Dijkstra {
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

export function dijkstra({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}): GridRow {
  const visitedNodesInOrder: GridRow = [];
  const unvisitedNodes = Utils.getAllNodes(grid);
  const totalRow = grid.length;
  const totalCol = grid[0].length;

  unvisitedNodes[Utils.getNodeKey(startNode)].distance = 0;
  const customMinHeap = new CustomHeap<Node>((a, b) => a.distance - b.distance);
  customMinHeap.insert(unvisitedNodes[Utils.getNodeKey(startNode)] as Node);

  while (!customMinHeap.isEmpty()) {
    const closestNode = customMinHeap.extractRoot() as Node;

    closestNode.isVisited = true;

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
        minHeap: customMinHeap,
      });
  }

  return visitedNodesInOrder;
}

class Utils {
  static getNodeKey(node: any): string {
    return `${node.columnIdx}-${node.rowIdx}`;
  }

  static getAllNodes(grid: Grid): UnvisitedNodes {
    const nodesMap: UnvisitedNodes = {};
    for (const row of grid) {
      for (const node of row) {
        nodesMap[Utils.getNodeKey(node)] = node.clone();
      }
    }
    return nodesMap;
  }

  static isEndNode(currNode: Node, finishNode: Node): boolean {
    return currNode.getRowIdx() === finishNode.getRowIdx()
      && currNode.getColumnIdx() === finishNode.getColumnIdx();
  }

  static updateUnvisitedNeighbors({node, grid, totalCol, totalRow, minHeap}: {node: Node, grid: UnvisitedNodes, totalCol: number, totalRow: number, minHeap: Heap}): void {
    const unvisitedNeighbors = Utils.getUnvisitedNeighbors({node, grid, totalCol, totalRow});
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      minHeap.insert(neighbor);
    }
  }

  static getUnvisitedNeighbors({node, grid, totalCol, totalRow}: {node: any, grid: UnvisitedNodes, totalCol: number, totalRow: number}): GridRow {
    const neighbors: GridRow = [];
    const {columnIdx: col, rowIdx: row} = node;
    if (!Dijkstra.isFirstRow(row)) {
      neighbors.push(
        grid[Utils.getNodeKey({columnIdx: col, rowIdx: row - 1})],
      );
    }
    if (!Dijkstra.isLastRow(row, totalRow - 1)) {
      neighbors.push(grid[Utils.getNodeKey({columnIdx: col, rowIdx: row + 1})]);
    }
    if (!Dijkstra.isFirstColumn(col)) {
      neighbors.push(grid[Utils.getNodeKey({columnIdx: col - 1, rowIdx: row})]);
    }
    if (!Dijkstra.isLastColumn(col, totalCol - 1)) {
      neighbors.push(grid[Utils.getNodeKey({columnIdx: col + 1, rowIdx: row})]);
    }

    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
}

// export function getNodesInShortestPathOrder(finishNode:any) {
//   const nodesInShortestPathOrder = [];
//   let currentNode = finishNode;
//   while (currentNode !== null) {
//     nodesInShortestPathOrder.unshift(currentNode);
//     currentNode = currentNode.previousNode;
//   }
//   return nodesInShortestPathOrder;
// }
