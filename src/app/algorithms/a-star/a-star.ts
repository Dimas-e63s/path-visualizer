import {Grid, GridRow} from '../../models/grid.types';
import {Node} from '../../models/Node.class';
import {Utils} from '../utils/utils.class';
import PriorityQueue from '../../data-structures/prio';

export class AStar {
  traverse({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}): any {
    if (startNode === null || endNode == null) {
      return;
    }
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    const gridMap = Utils.getNodesCopy(grid);
    const prioQ = new PriorityQueue();
    const nodesToAnimate: GridRow = [];
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    for (const node of gridMap.values()) {
      const nodeKey  = Utils.getNodeKey(node);
      gScore.set(nodeKey, Infinity);
      fScore.set(nodeKey, Infinity);
    }

    const startNodeKey = Utils.getNodeKey(startNode);
    gScore.set(startNodeKey, 0);
    fScore.set(startNodeKey, this.heuristic({currentNode: startNode, endNode}));

    prioQ.add(startNodeKey, fScore.get(startNodeKey));

    while (!prioQ.isEmpty()) {
      const currentNodeKey = prioQ.poll();
      const currentNode = gridMap.get(currentNodeKey) as Node;
      nodesToAnimate.push(currentNode);
      currentNode.setAsVisited()

      if (Utils.isEndNode(currentNode, endNode)) {
        break;
      }

      const neighbors = Utils.getUnvisitedNeighbors({
        node: currentNode,
        grid: gridMap,
        totalRow,
        totalCol
      });

      for (const neighbor of neighbors) {
        if (neighbor.isVisitedNode() || neighbor.isWall()) {
          continue;
        }

        const neighborKey = Utils.getNodeKey(neighbor);
        //@ts-ignore
        const tentative_gScore = gScore.get(currentNodeKey) + neighbor.weight;
        // @ts-ignore
        if (tentative_gScore < gScore.get(Utils.getNodeKey(neighbor))) {
          neighbor.previousNode = currentNode;
          gScore.set(neighborKey, tentative_gScore);
          fScore.set(neighborKey, tentative_gScore + this.heuristic({currentNode: neighbor, endNode}));

          if (!prioQ.hasValue(neighborKey)) {
            prioQ.add(neighborKey, fScore.get(neighborKey))
          }
        }
      }
    }

    const shortestPath = Utils.getNodesInShortestPathOrder(
      gridMap.get(Utils.getNodeKey(endNode)) as Node
    );

    return [nodesToAnimate, shortestPath];
  }

  private getPointsDistance(x: number, y: number) {
    return Math.abs(x - y);
  }

  private heuristic({currentNode, endNode}: {currentNode: Node, endNode: Node}): number {
    const colAbs = this.getPointsDistance(currentNode.getColumnIdx(), endNode.getColumnIdx());
    const rowAbs = this.getPointsDistance(currentNode.getRowIdx(), endNode.getRowIdx());

    return (rowAbs + colAbs) * 1.001;
  }
}
