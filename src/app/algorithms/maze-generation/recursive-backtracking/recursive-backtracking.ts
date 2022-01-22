import {Grid, GridMap, GridRow} from '../../../models/grid.types';
import {Utils} from '../../utils/utils.class';
import {NodeWeights, Node} from '../../../models/Node.class';

enum DirectionsEnum {
  N = 1,
  S = 2,
  E = 4,
  W = 8,
}

const DX = new Map<DirectionsEnum, number>([
  [DirectionsEnum.E, 1],
  [DirectionsEnum.W, -1],
  [DirectionsEnum.N, 0],
  [DirectionsEnum.S, 0],
]);

const DY = new Map<DirectionsEnum, number>([
  [DirectionsEnum.E, 0],
  [DirectionsEnum.W, 0],
  [DirectionsEnum.N, -1],
  [DirectionsEnum.S, 1],
]);

export class RecursiveBacktracking {
  private readonly totalCol: number;
  private readonly totalRow: number;
  private readonly visitedNodes = new Set<string>();
  private readonly grid: GridMap;
  private nodesToAnimate: GridRow = [];
  private readonly startNode: Node;
  private readonly endNode: Node;

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    this.startNode = startNode;
    this.endNode = endNode;
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    this.totalCol = totalCol;
    this.totalRow = totalRow;
    this.grid = Utils.getNodesCopy(grid);
  }

  helper2() {
    this.transformToWalls();
    this.generateMaze({cx: 0, cy: 0, grid: this.grid});
    const oldStart = this.grid.get(Utils.getNodeKey(this.startNode));
    const oldEnd = this.grid.get(Utils.getNodeKey(this.endNode));

    this.grid.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.grid.set(Utils.getNodeKey(this.endNode), this.endNode);
    return this.grid;
  }

  private transformToWalls() {
    for (const node of this.grid.values()) {
      this.grid.set(Utils.getNodeKey(node), node.clone({weight: NodeWeights.WALL}));
    }
  }

  private getNodeKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  private generateMaze({cx, cy, grid}: {cx: number, cy: number, grid: GridMap}) {
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

  private randomSort(array: DirectionsEnum[]) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
