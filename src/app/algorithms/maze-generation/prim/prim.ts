import {Grid, GridMap} from '../../../models/grid.types';
import {Utils} from '../../utils/utils.class';
import {Node, NodeWeights} from '../../../models/Node.class';
import {AlgorithmBase} from '../../algorithm-base/algorithm-base';
import {directions, DX, DY} from '../../../models/maze-generation.enum';

export class Prim extends AlgorithmBase {
  private readonly gridMap: GridMap;
  private readonly totalCol: number;
  private readonly totalRow: number;

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super({grid, startNode, endNode});
    this.gridMap = Utils.getNodesCopy(grid);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    this.totalCol = totalCol;
    this.totalRow = totalRow;
  }

  helper() {
    for (const node of this.gridMap.values()) {
      this.gridMap.set(`${node.getRowIdx()}-${node.getColumnIdx()}`, node.clone({weight: NodeWeights.WALL}));
    }
    this.generateMaze();

    this.gridMap.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.gridMap.set(Utils.getNodeKey(this.endNode), this.endNode);

    return this.gridMap;
  }

  private generateMaze() {
    const frontierArr: any = {};

    const randomCell = `${this.getRandomIdx(0, this.totalRow - 1)}-${this.getRandomIdx(0, this.totalCol - 1)}`;

    let initialCell = this.gridMap.get(randomCell)!;
    initialCell = initialCell.clone({weight: NodeWeights.EMPTY});
    this.gridMap.set(randomCell, initialCell);

    const {rowIdx, colIdx} = Utils.getNodeCoordinates(initialCell);

    directions.forEach(direction => {
      const r = rowIdx + DY.get(direction)!;
      const c = colIdx + DX.get(direction)!;
      const wr = r + DY.get(direction)!;
      const wc = c + DX.get(direction)!;

      if (
        wr >= 0
        && wr <= this.totalRow -1
        && wc >= 0
        && wc <= this.totalCol - 1
      ) {
        frontierArr[`${wr}-${wc}`] = `${wr}-${wc}`;
      }
    });

    while (Object.keys(frontierArr).length > 0) {
      const neighborKey = this.randomKey(frontierArr);
      delete frontierArr[neighborKey];
      const {colIdx, rowIdx} = Utils.getNodeCoordinates(this.gridMap.get(neighborKey)!);

      const neighbours: any = {};
      directions.forEach(direction => {
        const r = rowIdx + DY.get(direction)!;
        const c = colIdx + DX.get(direction)!;
        const wr = r + DY.get(direction)!;
        const wc = c + DX.get(direction)!;
        if (
          wr >= 0
          && wr <= this.totalRow -1
          && wc >= 0
          && wc <= this.totalCol - 1
          && !this.gridMap.get(`${wr}-${wc}`)!.isWall()
        ) {
          neighbours[`${r}-${c}`] = `${r}-${c}`;
        }

        if (
          wr >= 0
          && wr <= this.totalRow -1
          && wc >= 0
          && wc <= this.totalCol - 1
          && this.gridMap.get(`${wr}-${wc}`)!.isWall()
        ) {
          frontierArr[`${wr}-${wc}`] = `${wr}-${wc}`;
        }
      });

      const randNeighbour = this.randomKey(neighbours);
      const randNeighborCopy = this.gridMap.get(randNeighbour)!.clone({weight: NodeWeights.EMPTY});
      const randFCopy = this.gridMap.get(neighborKey)!.clone({weight: NodeWeights.EMPTY});

      this.gridMap.set(randNeighbour, randNeighborCopy);
      this.gridMap.set(neighborKey, randFCopy);
    }
  }

  private getRandomIdx(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomKey(obj: any) {
    const keys = Object.keys(obj);
    return keys[(keys.length * Math.random()) << 0];
  };
}
