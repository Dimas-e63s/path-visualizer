import {Node} from '../../models/Node.class';
import {Grid, GridMap, GridRow} from '../../models/grid.types';
import {Utils} from '../utils/utils.class';
import {Dijkstra} from '../dijkstra/dijkstra';
import {Stack} from '@datastructures-js/stack';
import {Queue} from '@datastructures-js/queue';
import {AlgorithmBase} from '../algorithm-base/algorithm-base';

export class UnweightedAlgorithms extends AlgorithmBase {
  constructor({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}) {
    super({grid, startNode, endNode});
  }

  // TODO: - extract type
  dfs(): [Node[], Node[]] {
    const stack = new Stack<Node>();
    const gridMap = Utils.getNodesCopy(this.grid);

    stack.push(gridMap.get(Utils.getNodeKey(this.startNode)) as Node);

    const {totalRow, totalCol} = Utils.getGridSize(this.grid);
    const visitedNodes: GridRow = [];

    while (!stack.isEmpty()) {
      const currentNode = stack.pop();

      if (currentNode.isVisitedNode() || currentNode.isWall()) {
        continue;
      }

      currentNode.setAsVisited();
      visitedNodes.push(currentNode);

      if (Utils.isEndNode(currentNode, this.endNode)) {
        break;
      }

      const neighbors = UnweightedAlgorithms.getNeighbors({
        currentNode,
        grid: gridMap,
        totalRow,
        totalCol,
      });

      neighbors.forEach((neighbor) => {
        if (!neighbor.isVisitedNode()) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      });
    }

    const shortestPath = Utils.getNodesInShortestPathOrder(
      gridMap.get(Utils.getNodeKey(this.endNode)) as Node,
    );

    return [visitedNodes, shortestPath];
  }

  // TODO: - extract type
  bfs(): [Node[], Node[]] {
    const queue = new Queue<Node>();
    const gridMap = Utils.getNodesCopy(this.grid);
    const exploredNodes = new Set().add(Utils.getNodeKey(this.startNode));
    queue.enqueue(gridMap.get(Utils.getNodeKey(this.startNode)) as Node);
    const {totalRow, totalCol} = Utils.getGridSize(this.grid);
    const visitedNodes = [];

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();
      if (currentNode.isWall()) {
        continue;
      }

      currentNode.setAsVisited();
      visitedNodes.push(currentNode);

      if (Utils.isEndNode(currentNode, this.endNode)) {
        break;
      }

      const neighbors = UnweightedAlgorithms.getNeighbors({
        currentNode,
        grid: gridMap,
        totalRow,
        totalCol,
      });

      neighbors.forEach((neighbor) => {
        if (!exploredNodes.has(Utils.getNodeKey(neighbor))) {
          exploredNodes.add(Utils.getNodeKey(neighbor));
          neighbor.previousNode = currentNode;
          queue.enqueue(neighbor);
        }
      });
    }

    const shortestPath = Utils.getNodesInShortestPathOrder(
      gridMap.get(Utils.getNodeKey(this.endNode)) as Node,
    );

    return [visitedNodes, shortestPath];
  }

  // TODO:
  //  - extract type
  //  - add return type
  static getNeighbors({
    currentNode, grid, totalCol,
    totalRow,
  }: {currentNode: Node, grid: GridMap, totalCol: number, totalRow: number}) {
    const neighbors = [];
    const {rowIdx, colIdx} = Utils.getNodeCoordinates(currentNode);

    if (!Dijkstra.isFirstColumn(colIdx)) {
      neighbors.push(
          Utils.getLeftNode(currentNode, grid),
      );
    }

    if (!Dijkstra.isLastRow(rowIdx, totalRow - 1)) {
      neighbors.push(
          Utils.getBelowNode(currentNode, grid),
      );
    }

    if (!Dijkstra.isLastColumn(colIdx, totalCol - 1)) {
      neighbors.push(
          Utils.getRightNode(currentNode, grid),
      );
    }

    if (!Dijkstra.isFirstRow(rowIdx)) {
      neighbors.push(
          Utils.getUpNode(currentNode, grid),
      );
    }

    return neighbors;
  }
}
