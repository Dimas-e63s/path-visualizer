import {Grid, GridMap} from '../../../models/grid.types';
import {Utils} from '../../utils/utils.class';
import {NodeWeights, Node} from '../../../models/Node.class';
import {AlgorithmBase} from '../../algorithm-base/algorithm-base';
import {DirectionsEnum, DX, DY} from '../../../models/maze-generation.enum';

export class Backtracking extends AlgorithmBase {
  protected readonly totalCol: number;
  protected readonly totalRow: number;
  protected readonly visitedNodes = new Set<string>();
  protected readonly gridMap: GridMap;

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super({grid, startNode, endNode});
    this.gridMap = Utils.getNodesCopy(this.grid);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    this.totalCol = totalCol;
    this.totalRow = totalRow;
    this.transformToWalls();
  }

  getMaze() {
    this.generateMaze({nodeKey: '0-0', grid: this.gridMap});

    this.gridMap.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.gridMap.set(Utils.getNodeKey(this.endNode), this.endNode);
    return this.gridMap;
  }

  generateMaze({nodeKey, grid}: {nodeKey: string, grid: GridMap}) {
    throw new Error('The method wasn\'t implemented.');
  }

  protected transformToWalls() {
    for (const node of this.gridMap.values()) {
      this.gridMap.set(Utils.getNodeKey(node), node.clone({weight: NodeWeights.WALL}));
    }
  }

  private randomSort(array: DirectionsEnum[]) {
    return array.slice().sort(() => Math.random() - 0.5);
  }

  protected getRandomDirections(): DirectionsEnum[] {
    return this.randomSort([DirectionsEnum.N, DirectionsEnum.S, DirectionsEnum.E, DirectionsEnum.W]);
  }

  protected getEmptyNode(nodeKey: string): Node {
    return this.gridMap.get(nodeKey)!.clone({weight: NodeWeights.EMPTY});
  }

  protected makePassage(nodeKey: string): void {
    this.visitedNodes.add(nodeKey);
    this.gridMap.set(nodeKey, this.getEmptyNode(nodeKey));
  }

  private parseNodeKey(nodeKey: string): {rowIdx: number, colIdx: number} {
    const [rowIdx, colIdx] = nodeKey.split('-').map(val => Number(val));

    return {
      rowIdx,
      colIdx,
    };
  }

  protected getNeighborKey(nodeKey: string, direction: DirectionsEnum): string {
    const {rowIdx, colIdx} = this.parseNodeKey(nodeKey);
    return `${Backtracking.getNeighborRowIdx(rowIdx, direction)}-${Backtracking.getNeighborColIdx(colIdx, direction)}`;
  }

  private static getNeighborColIdx(colIdx: number, direction: DirectionsEnum): number {
    return colIdx + DX.get(direction)!;
  }

  private static getNeighborRowIdx(rowIdx: number, direction: DirectionsEnum): number {
    return rowIdx + DY.get(direction)!;
  }

  protected isUnvisitedNode({neighborKey, wallKey}: {neighborKey: string, wallKey: string}) {
    return this.gridMap.has(neighborKey)
      && !this.visitedNodes.has(neighborKey)
      && !this.visitedNodes.has(wallKey);
  }
}

