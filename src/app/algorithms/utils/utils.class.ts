import {Grid, GridMap, GridNodeCoordinates, GridRow, GridSize} from '../../models/grid.types';
import {Node} from '../../models/Node.class';
import {Dijkstra} from '../dijkstra/dijkstra';

export interface UnvisitedNodes {
  [key: string]: Node;
}

export class Utils {
  static getNodeKey(node: Node): string {
    return `${node.getRowIdx()}-${node.getColumnIdx()}`;
  }

  static getGridRowSize(grid: Grid): number {
    return grid.length;
  }

  static getGridColumnSize(grid: Grid): number {
    return grid.length > 0 ? grid[0].length : 0;
  }

  static getGridSize(grid: Grid): GridSize {
    return {
      totalRow: Utils.getGridRowSize(grid),
      totalCol: Utils.getGridColumnSize(grid),
    };
  }

  static getNodesCopy(grid: Grid): GridMap {
    const nodes: GridMap = new Map();
    for (const row of grid) {
      for (const node of row) {
        nodes.set(Utils.getNodeKey(node), node.clone());
      }
    }
    return nodes;
  }

  static traverseGrid({
                        visitedNode,
                        endNode,
                        gridSize,
                      }: {visitedNode: GridRow, endNode: Node, gridSize: GridSize}) {

  }

  static isEndNode(currNode: Node, endNode: Node): boolean {
    return currNode.getRowIdx() === endNode.getRowIdx()
      && currNode.getColumnIdx() === endNode.getColumnIdx();
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

  static getNodeCoordinates(node: Node): GridNodeCoordinates {
    return {
      rowIdx: node.getRowIdx(),
      colIdx: node.getColumnIdx(),
    };
  }

  static getBelowNode(node: Node, grid: GridMap): Node {
    const {rowIdx, colIdx} = Utils.getNodeCoordinates(node);
    const nodeBelow = new Node({colIdx, rowIdx: rowIdx + 1});

    return grid.get(Utils.getNodeKey(nodeBelow)) as Node;
  }

  static getLeftNode(node: Node, grid: GridMap): Node {
    const {rowIdx, colIdx} = Utils.getNodeCoordinates(node);
    const leftNode = new Node({colIdx: colIdx - 1, rowIdx});

    return grid.get(Utils.getNodeKey(leftNode)) as Node;
  }

  static getUpNode(node: Node, grid: GridMap): Node {
    const {rowIdx, colIdx} = Utils.getNodeCoordinates(node);
    const upNode = new Node({colIdx, rowIdx: rowIdx - 1});

    return grid.get(Utils.getNodeKey(upNode)) as Node;
  }

  static getRightNode(node: Node, grid: GridMap): Node {
    const {rowIdx, colIdx} = Utils.getNodeCoordinates(node);
    const rightNode = new Node({colIdx: colIdx + 1, rowIdx});

    return grid.get(Utils.getNodeKey(rightNode)) as Node;
  }

  static getUnvisitedNeighbors({
                                 node,
                                 grid,
                                 totalCol,
                                 totalRow,
                               }: {node: any, grid: GridMap, totalCol: number, totalRow: number}): GridRow {
    const neighbors: GridRow = [];
    const {columnIdx: col, rowIdx: row} = node;
    if (!Dijkstra.isFirstRow(row)) {
      neighbors.push(Utils.getUpNode(node, grid));
    }
    if (!Dijkstra.isLastRow(row, totalRow - 1)) {
      neighbors.push(Utils.getBelowNode(node, grid));
    }
    if (!Dijkstra.isFirstColumn(col)) {
      neighbors.push(Utils.getLeftNode(node, grid));
    }
    if (!Dijkstra.isLastColumn(col, totalCol - 1)) {
      neighbors.push(Utils.getRightNode(node, grid));
    }

    return neighbors.filter(neighbor => !neighbor.isVisitedNode());
  }

  static isPreviousNodeExist({previousNode}: Node): boolean {
    return previousNode !== null;
  }

  static getNodesInShortestPathOrder(endNode: Node): GridRow {
    const shortestPath: GridRow = [];

    let currentNode = endNode;
    while (Utils.isPreviousNodeExist(currentNode)) {
      shortestPath.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    return shortestPath;
  }
}