import {Grid, GridMap, GridRow} from '../../../models/grid.types';
import {Utils} from '../../utils/utils.class';
import {NodeWeights, Node} from '../../../models/Node.class';
import {AlgorithmBase} from '../../algorithm-base/algorithm-base';
import {DirectionsEnum, DX, DY} from '../../../models/maze-generation.enum';

export class Backtracking extends AlgorithmBase {
  protected readonly totalCol: number;
  protected readonly totalRow: number;
  protected readonly visitedNodes = new Set<string>();
  private readonly gridMap: GridMap;
  private nodesToAnimate: GridRow = [];

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super({grid, startNode, endNode});
    this.gridMap = Utils.getNodesCopy(this.grid);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    this.totalCol = totalCol;
    this.totalRow = totalRow;
    this.transformToWalls();
  }

  getMaze() {
    this.generateMaze({cx: 0, cy: 0, grid: this.gridMap});

    this.gridMap.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.gridMap.set(Utils.getNodeKey(this.endNode), this.endNode);
    return this.gridMap;
  }

  generateMaze({cx, cy, grid}: {cx: number, cy: number, grid: GridMap}) {
    throw new Error('The method wasn\'t implemented.');
  }

  protected transformToWalls() {
    for (const node of this.gridMap.values()) {
      this.gridMap.set(Utils.getNodeKey(node), node.clone({weight: NodeWeights.WALL}));
    }
  }

  protected getNodeKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  protected randomSort(array: DirectionsEnum[]) {
    return array.slice().sort(() => Math.random() - 0.5);
  }

  protected getRandomDirections(): DirectionsEnum[] {
    return this.randomSort([DirectionsEnum.N, DirectionsEnum.S, DirectionsEnum.E, DirectionsEnum.W]);
  }

  protected removeWall(nodeKey: string): Node {
    return this.gridMap.get(nodeKey)!.clone({weight: NodeWeights.EMPTY});
  }
}

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

