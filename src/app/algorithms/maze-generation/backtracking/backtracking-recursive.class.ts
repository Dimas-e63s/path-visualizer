import {Grid, GridMap} from '../../../models/grid.types';
import {Node} from '../../../models/Node.class';
import {Backtracking} from './backtracking';

export class BacktrackingRecursive extends Backtracking {
  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super(grid, startNode, endNode);
  }

  override generateMaze({nodeKey, grid}: {nodeKey: string, grid: GridMap}) {
    // 1. Given a current cell as a parameter,
    // 2. Mark the current cell as visited
    // 3. While the current cell has any unvisited neighbour cells
    //      Choose one of the unvisited neighbours
    //      Remove the wall between the current cell and the chosen cell
    //      Invoke the routine recursively for a chosen cell

    this.makePassage(nodeKey);

    this.getRandomDirections().forEach(direction => {
      const wallKey = this.getNeighborKey(nodeKey, direction);
      const neighborKey = this.getNeighborKey(wallKey, direction);

      if (this.isUnvisitedNode({neighborKey, wallKey})) {
        this.makePassage(wallKey)
        this.generateMaze({nodeKey: neighborKey, grid});
      }
    });
  }
}
