import {Node} from '../../models/Node.class';
import {Grid, GridMap} from '../../models/grid.types';
import {Utils} from '../utils/utils.class';
import {Dijkstra} from '../dijkstra/dijkstra';
import { Stack } from '@datastructures-js/stack';
import { Queue } from '@datastructures-js/queue';

export class UnweightedAlgorithms {
  dfs({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}) {
    const stack = new Stack<Node>();
    const gridMap = Utils.getNodesCopy(grid);
    const exploredNodes = new Set().add(Utils.getNodeKey(startNode));
    stack.push(gridMap.get(Utils.getNodeKey(startNode)) as Node);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    const visitedNodes = [];

    while (!stack.isEmpty()) {
      const currentNode = stack.pop();
      visitedNodes.push(currentNode);

      exploredNodes.add(Utils.getNodeKey(currentNode));

      if (Utils.isEndNode(currentNode, endNode)) {
        break;
      }

      if (currentNode.isWall()) {
        continue;
      }

      const neighbors = UnweightedAlgorithms.getNeighbors({
        currentNode,
        grid: gridMap,
        totalRow,
        totalCol
      })

      neighbors.forEach(neighbor => {
        if (!exploredNodes.has(Utils.getNodeKey(neighbor))) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      })
    }

    const shortestpath = Utils.getNodesInShortestPathOrder(
      gridMap.get(Utils.getNodeKey(endNode)) as Node
    )

    return [visitedNodes, shortestpath]
  }

  bfs({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}) {
    const queue = new Queue<Node>();
    const gridMap = Utils.getNodesCopy(grid);
    const exploredNodes = new Set().add(Utils.getNodeKey(startNode));
    queue.enqueue(gridMap.get(Utils.getNodeKey(startNode)) as Node);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    const visitedNodes = [];

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();
      currentNode.setAsVisited();
      visitedNodes.push(currentNode);

      if (Utils.isEndNode(currentNode, endNode)) {
        break;
      }

      if (currentNode.isWall()) {
        continue;
      }

      const neighbors = UnweightedAlgorithms.getNeighbors({
        currentNode,
        grid: gridMap,
        totalRow,
        totalCol
      });

      neighbors.forEach(neighbor => {
        if (!exploredNodes.has(Utils.getNodeKey(neighbor))) {
          exploredNodes.add(Utils.getNodeKey(neighbor));
          neighbor.previousNode = currentNode;
          queue.enqueue(neighbor);
        }
      })
    }

    const shortestPath = Utils.getNodesInShortestPathOrder(
      gridMap.get(Utils.getNodeKey(endNode)) as Node
    )

    return [visitedNodes, shortestPath]
  }

  static getNeighbors({
                        currentNode, grid, totalCol,
                        totalRow
                      }: {currentNode: Node, grid: GridMap, totalCol: number, totalRow: number}) {
    const neighbors = [];
    const {rowIdx, colIdx} = Utils.getNodeCoordinates(currentNode);

    if (!Dijkstra.isFirstColumn(colIdx)) {
      const neighbor = Utils.getLeftNode(currentNode, grid);
      neighbors.push(neighbor)
    }

    if (!Dijkstra.isLastRow(rowIdx, totalRow - 1)) {
      const neighbor = Utils.getBelowNode(currentNode, grid);
      neighbors.push(neighbor)
    }

    if (!Dijkstra.isLastColumn(colIdx, totalCol - 1)) {
      const neighbor = Utils.getRightNode(currentNode, grid);
      neighbors.push(neighbor);
    }

    if (!Dijkstra.isFirstRow(rowIdx)) {
      const neighbor = Utils.getUpNode(currentNode, grid);
      neighbors.push(neighbor);
    }

    return neighbors;
  }
}
