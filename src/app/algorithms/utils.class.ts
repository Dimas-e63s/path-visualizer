import {Grid, GridRow, GridSize} from '../models/grid.types';
import {CustomHeap} from '@datastructures-js/heap';
import {Node} from '../models/Node.class';
import {Dijkstra} from './dijkstra';

export interface UnvisitedNodes {
  [key: string]: Node;
}

export class Utils {
  static getNodeKey(node: any): string {
    return `${node.columnIdx}-${node.rowIdx}`;
  }

  static getGridRowSize(grid: Grid): number {
    return grid.length;
  }

  static getGridColumnSize(grid: Grid): number {
    return grid[0].length;
  }

  static getGridSize(grid: Grid): GridSize {
    return {
      totalRow: Utils.getGridRowSize(grid),
      totalCol: Utils.getGridColumnSize(grid),
    };
  }

  static getNodesCopy(grid: Grid): UnvisitedNodes {
    const nodesMap: UnvisitedNodes = {};
    for (const row of grid) {
      for (const node of row) {
        nodesMap[Utils.getNodeKey(node)] = node.clone();
      }
    }
    return nodesMap;
  }

  static traverseGrid({
                        minHeap,
                        visitedNode,
                        endNode,
                        gridSize,
                      }: {minHeap: CustomHeap<Node>, visitedNode: GridRow, endNode: Node, gridSize: GridSize}) {

  }

  static isEndNode(currNode: Node, finishNode: Node): boolean {
    return currNode.getRowIdx() === finishNode.getRowIdx()
      && currNode.getColumnIdx() === finishNode.getColumnIdx();
  }

  static updateUnvisitedNeighbors({
                                    node,
                                    grid,
                                    totalCol,
                                    totalRow,
                                  }: {node: Node, grid: any, totalCol: number, totalRow: number}): void {
    const unvisitedNeighbors = Utils.getUnvisitedNeighbors({node, grid, totalCol, totalRow});
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + neighbor.weight;
      neighbor.previousNode = node;
    }
  }

  static getUnvisitedNeighbors({
                                 node,
                                 grid,
                                 totalCol,
                                 totalRow,
                               }: {node: any, grid: UnvisitedNodes, totalCol: number, totalRow: number}): GridRow {
    const neighbors: GridRow = [];
    const {columnIdx: col, rowIdx: row} = node;
    if (!Dijkstra.isFirstRow(row)) {
      //@ts-ignore
      neighbors.push(grid.get(`${row - 1}-${col}`));
    }
    if (!Dijkstra.isFirstColumn(col)) {
      //@ts-ignore
      neighbors.push(grid.get(`${row}-${col- 1}`));
    }
    if (!Dijkstra.isLastColumn(col, totalCol - 1)) {
      //@ts-ignore
      neighbors.push(grid.get(`${row}-${col + 1}`));
    }
    if (!Dijkstra.isLastRow(row, totalRow - 1)) {
      //@ts-ignore
      neighbors.push(grid.get(`${row + 1}-${col}`));
    }

    return neighbors.filter(neighbor => !neighbor.isVisitedNode());
  }

  static getNodesInShortestPathOrder({startNode, finishNode, grid}: {startNode: Node, finishNode: Node, grid: UnvisitedNodes}) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode.previousNode.columnIdx !== null && currentNode.previousNode.rowIdx !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    if (nodesInShortestPathOrder.length === 0) {
      return [];
    }
    nodesInShortestPathOrder.length = nodesInShortestPathOrder.length - 1;
    return nodesInShortestPathOrder;
  }
}
