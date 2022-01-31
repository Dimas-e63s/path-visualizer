import {Grid} from '../../models/grid.types';
import {Node} from '../../models/Node.class';

export class AlgorithmBase {
  protected readonly grid: Grid;
  protected readonly startNode: Node;
  protected readonly endNode: Node;

  constructor({grid, startNode, endNode}: {grid: Grid, startNode: Node, endNode: Node}) {
    this.grid = grid;
    this.startNode = startNode;
    this.endNode = endNode;
  }
}
