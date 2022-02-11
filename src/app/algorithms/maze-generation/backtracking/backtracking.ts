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

