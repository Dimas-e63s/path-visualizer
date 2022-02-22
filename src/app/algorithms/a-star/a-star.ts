import {Grid, GridMap, GridRow} from '../../models/grid.types';
import {Node} from '../../models/Node.class';
import {Utils} from '../../utils/utils.class';
import PriorityQueue from '../../data-structures/prio';
import {AlgorithmBase} from '../algorithm-base/algorithm-base';

export class AStar extends AlgorithmBase {
  // TODO: - extract type
  constructor({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}) {
    super({grid, startNode, endNode});
  }

  // TODO:
  //  - extract type
  //  - the function is long -- refactor it
  traverse(): [Node[], Node[]] {
    if (this.startNode === null || this.endNode == null) {
      throw new Error(`No destination node was provided. Given startNode: ${this.startNode}, endNode: ${this.endNode}`);
    }

    const {totalRow, totalCol} = Utils.getGridSize(this.grid);
    const gridMap = Utils.getNodesCopy(this.grid);
    const nodesToAnimate: GridRow = [];

    const prioQ = new PriorityQueue();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    AStar.populateMapsWithDefaultValues({
      gScore,
      fScore,
      grid: gridMap,
    });

    AStar.setStartNode({
      startNodeKey: Utils.getNodeKey(this.startNode),
      startNode: this.startNode,
      endNode: this.endNode,
      fScore,
      gScore,
      prioQ,
    });

    while (!prioQ.isEmpty()) {
      const currentNodeKey = prioQ.poll();
      const currentNode = gridMap.get(currentNodeKey) as Node;
      nodesToAnimate.push(currentNode);
      currentNode.setAsVisited();

      if (Utils.isEndNode(currentNode, this.endNode)) {
        break;
      }

      const neighbors = Utils.getUnvisitedNeighbors({
        node: currentNode,
        grid: gridMap,
        totalRow,
        totalCol,
      });

      for (const neighbor of neighbors) {
        if (AStar.isInvalidNode(neighbor)) {
          continue;
        }

        const neighborKey = Utils.getNodeKey(neighbor);
        const tentative_gScore = gScore.get(currentNodeKey)! + neighbor.weight;
        if (AStar.isNeighborHasCloserPath({
          tentative_gScore,
          gScore, neighbor,
        })) {
          neighbor.previousNode = currentNode;
          gScore.set(neighborKey, tentative_gScore);
          fScore.set(neighborKey, tentative_gScore + AStar.calculateHeuristic({currentNode: neighbor, endNode: this.endNode}));

          if (!prioQ.hasValue(neighborKey)) {
            prioQ.add(neighborKey, fScore.get(neighborKey));
          }
        }
      }
    }

    const shortestPath = Utils.getNodesInShortestPathOrder(
      gridMap.get(Utils.getNodeKey(this.endNode)) as Node,
    );

    return [nodesToAnimate, shortestPath];
  }

  // TODO: - extract type
  static setStartNode({
    startNodeKey,
    gScore,
    fScore,
    prioQ,
    endNode,
    startNode,
  }: {
    startNodeKey: string,
    gScore: Map<string, number>,
    fScore: Map<string, number>,
    prioQ: PriorityQueue,
    endNode: Node,
    startNode: Node
  }): void {
    gScore.set(startNodeKey, 0);
    fScore.set(startNodeKey, AStar.calculateHeuristic({currentNode: startNode, endNode}));
    prioQ.add(startNodeKey, fScore.get(startNodeKey));
  }

  static isInvalidNode(node: Node): boolean {
    return node.isVisitedNode() || node.isWall();
  }

  // TODO: - extract type
  static populateMapsWithDefaultValues({
    gScore,
    fScore,
    grid,
  }:
                                         {
                                           gScore: Map<string, number>,
                                           fScore: Map<string, number>,
                                           grid: GridMap
                                         },
  ): void {
    for (const node of grid.values()) {
      const nodeKey = Utils.getNodeKey(node);
      gScore.set(nodeKey, Infinity);
      fScore.set(nodeKey, Infinity);
    }
  }

  static getPointsDistance(x: number, y: number) {
    return Math.abs(x - y);
  }

  static calculateHeuristic({currentNode, endNode}: {currentNode: Node, endNode: Node}): number {
    const colAbs = AStar.getPointsDistance(currentNode.getColumnIdx(), endNode.getColumnIdx());
    const rowAbs = AStar.getPointsDistance(currentNode.getRowIdx(), endNode.getRowIdx());

    return (rowAbs + colAbs) * 1.001;
  }

  // TODO: - extract type
  static isNeighborHasCloserPath({
    tentative_gScore,
    gScore,
    neighbor,
  }: {
    tentative_gScore: number,
    gScore: Map<string, number>,
    neighbor: Node
  }) {
    return tentative_gScore < gScore.get(Utils.getNodeKey(neighbor))!;
  }
}
