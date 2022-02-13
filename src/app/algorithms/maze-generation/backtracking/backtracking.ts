import {Grid} from '../../../models/grid.types';
import {Node} from '../../../models/Node.class';
import {DirectionsEnum} from '../../../models/maze-generation.enum';
import {MazeGeneration} from '../maze-generation';

export class Backtracking extends MazeGeneration {
  protected readonly visitedNodes = new Set<string>();

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super(grid, startNode, endNode);
  }

  protected getRandomDirections(): DirectionsEnum[] {
    return this.randomSort([DirectionsEnum.N, DirectionsEnum.S, DirectionsEnum.E, DirectionsEnum.W]);
  }

  protected makePassage(nodeKey: string): void {
    this.visitedNodes.add(nodeKey);
    this.gridMap.set(nodeKey, this.getEmptyNode(nodeKey));
  }

  protected isUnvisitedNode({neighborKey, wallKey}: {neighborKey: string, wallKey: string}) {
    return this.gridMap.has(neighborKey)
      && !this.visitedNodes.has(neighborKey)
      && !this.visitedNodes.has(wallKey);
  }
}

