import {Grid, GridMap} from '../../../models/grid.types';
import {Node, NodeWeights} from '../../../models/Node.class';
import {DirectionsEnum, DX, DY} from '../../../models/maze-generation.enum';
import {Backtracking} from './backtracking';

export class BacktrackingRecursive extends Backtracking {
  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super(grid, startNode, endNode);
  }

  override generateMaze({cx, cy, grid}: {cx: number, cy: number, grid: GridMap}) {
    // 1. Given a current cell as a parameter,
    // 2. Mark the current cell as visited
    // 3. While the current cell has any unvisited neighbour cells
    //      Choose one of the unvisited neighbours
    //      Remove the wall between the current cell and the chosen cell
    //      Invoke the routine recursively for a chosen cell

    const directions = this.randomSort([DirectionsEnum.N, DirectionsEnum.S, DirectionsEnum.E, DirectionsEnum.W]);
    this.visitedNodes.add(this.getNodeKey(cy, cx));

    const currNode = grid.get(this.getNodeKey(cy, cx))!.clone({weight: NodeWeights.EMPTY});
    grid.set(this.getNodeKey(cy, cx), currNode);

    directions.forEach(direction => {
      let wallX = cx + DX.get(direction)!;
      let wallY = cy + DY.get(direction)!;

      let newX = wallX + DX.get(direction)!;
      let newY = wallY + DY.get(direction)!;

      if (
        (newY >= 0 && newY < this.totalRow)
        && (newX >= 0 && newX < this.totalCol)
        && !this.visitedNodes.has(this.getNodeKey(newY, newX))
        && !this.visitedNodes.has(this.getNodeKey(wallY, wallX))
      ) {
        this.visitedNodes.add(this.getNodeKey(wallY, wallX));
        const oldWall = grid.get(this.getNodeKey(wallY, wallX))!.clone({weight: NodeWeights.EMPTY});
        grid.set(this.getNodeKey(wallY, wallX), oldWall);
        this.generateMaze({cx: newX, cy: newY, grid});
      }
    });
  }
}
