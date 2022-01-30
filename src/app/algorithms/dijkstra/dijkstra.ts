import {Node, NodeWeights} from '../../models/Node.class';
import {GridRow, Grid} from '../../models/grid.types';
import {Utils} from '../utils/utils.class';
import {PriorityQueue} from '@datastructures-js/priority-queue';

// TODO:
//  - optimize traverse() with priorityQueue
//  - optimize further with Fibonacci Queue

interface NodeOption {
  node: Node;
  timestamp: number;
}

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

    //@ts-ignore
    const prioQ = new PriorityQueue<NodeOption>({
      compare: (a: NodeOption, b: NodeOption) => {
        if (a.node.distance < b.node.distance) return -1; // do not swap
        if (a.node.distance > b.node.distance) return 1; // swap

        // salaries are the same, compare rank
        return a.timestamp > b.timestamp ? 1 : 0;
      }
    });

    const gridCopy = [];
    for (const node of unvisitedNodes.values()) {
      gridCopy.push(node);
    }

    const endNodeId = Utils.getNodeKey(this.endNode);
    const {totalRow, totalCol} = Utils.getGridSize(this.grid);
    prioQ.enqueue({node: unvisitedNodes.get(Utils.getNodeKey(this.startNode)), timestamp: Date.now()});
    const counter = {counter: 1};

    while (!prioQ.isEmpty()) {
      Dijkstra.sortNodesByDistance(gridCopy);
      const poll1 = prioQ.dequeue();
      // debugger
      const closestNode = poll1.node;
      console.log(Utils.getNodeKey(closestNode), poll1.timestamp);

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
          prioQ,
          counter
        });
    }

    const shortestPath = Utils.getNodesInShortestPathOrder(
      unvisitedNodes.get(endNodeId) as Node,
    );

    return [visitedNodesInOrder, shortestPath];
  }
}
