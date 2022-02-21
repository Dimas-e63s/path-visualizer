import {Utils} from '../utils/utils.class';
import {Grid, GridMap} from '../../models/grid.types';
import {Node, NodeWeights} from '../../models/Node.class';
import {AlgorithmBase} from '../algorithm-base/algorithm-base';
import {DirectionsEnum, DX, DY} from '../../models/maze-generation.enum';
import {NodeCoordinates} from '../../services/store.service';

export class MazeGeneration extends AlgorithmBase {
  protected readonly totalCol: number;
  protected readonly totalRow: number;
  protected readonly gridMap: GridMap;

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super({grid, startNode, endNode});
    this.gridMap = Utils.getNodesCopy(this.grid);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    this.totalCol = totalCol;
    this.totalRow = totalRow;
  }

  getMaze() {
    this.transformToWalls()

    this.generateMaze({nodeKey: '0-0'});

    this.gridMap.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.gridMap.set(Utils.getNodeKey(this.endNode), this.endNode);
    return this.gridMap;
  }

  generateMaze({nodeKey}: {nodeKey?: string} = {}) {
    throw new Error('The method wasn\'t implemented.');
  }

  protected parseNodeKey(nodeKey: string): NodeCoordinates {
    const [rowIdx, colIdx] = nodeKey.split('-').map(key => Number(key));

    return {
      rowIdx,
      colIdx
    }
  }

  protected getEmptyNode(nodeKey: string): Node {
    return this.gridMap.get(nodeKey)!.clone({weight: NodeWeights.EMPTY});
  }

  protected getNeighborKey(nodeKey: string, direction: DirectionsEnum): string {
    const {rowIdx, colIdx} = this.parseNodeKey(nodeKey);
    return `${MazeGeneration.getNeighborRowIdx(rowIdx, direction)}-${MazeGeneration.getNeighborColIdx(colIdx, direction)}`;
  }

  private static getNeighborColIdx(colIdx: number, direction: DirectionsEnum): number {
    return colIdx + DX.get(direction)!;
  }

  private static getNeighborRowIdx(rowIdx: number, direction: DirectionsEnum): number {
    return rowIdx + DY.get(direction)!;
  }

  protected randomSort<T>(array: Array<T>): Array<T> {
    return array.slice().sort(() => Math.random() - 0.5);
  }

  protected transformToWalls() {
    for (const node of this.gridMap.values()) {
      this.gridMap.set(Utils.getNodeKey(node), node.clone({weight: NodeWeights.WALL}));
    }
  }
}
