import {Node, NodeWeights} from '../../models/Node.class';
import {GridRow, Grid} from '../../models/grid.types';
import {Utils} from '../utils/utils.class';

// TODO:
//  - optimize traverse() with priorityQueue

export class Dijkstra {
  private readonly grid: Grid;
  private readonly startNode: Node;
  private readonly endNode: Node;

  constructor({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}) {
    this.grid = grid;
    this.startNode = startNode;
    this.endNode = endNode;
  }
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

  static sortNodesByDistance(unvisitedNodes: GridRow): void {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }

  static isNodeAccessible(node: Node): boolean {
    return node.distance !== NodeWeights.WALL;
  }

  traverse(): [GridRow, GridRow] {
    const visitedNodesInOrder: GridRow = [];
    this.startNode.distance = 0;
    const unvisitedNodes = Utils.getNodesCopy(this.grid);

    const gridCopy = [];
    for (const node of unvisitedNodes.values()) {
      gridCopy.push(node);
    }

    const endNodeId = Utils.getNodeKey(this.endNode);
    const {totalRow, totalCol} = Utils.getGridSize(this.grid);

    while (gridCopy.length > 0) {
      Dijkstra.sortNodesByDistance(gridCopy);
      const closestNode = gridCopy.shift() as Node;

      if (closestNode.isWall()) {
        continue;
      }

      if (!Dijkstra.isNodeAccessible(closestNode)) {
        break;
      }

      closestNode.setAsVisited();
      visitedNodesInOrder.push(closestNode);

      if (Utils.isEndNode(closestNode, this.endNode)) {
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

    const shortestPath = Utils.getNodesInShortestPathOrder(
      unvisitedNodes.get(endNodeId) as Node,
    );

    return [visitedNodesInOrder, shortestPath];
  }
}
