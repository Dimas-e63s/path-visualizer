import {Grid, GridMap} from '../../../models/grid.types';
import {Utils} from '../../utils/utils.class';
import {Node, NodeWeights} from '../../../models/Node.class';

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

const directions = [DirectionsEnum.N, DirectionsEnum.S, DirectionsEnum.W, DirectionsEnum.E];

export class Prim {
  private grid: GridMap;
  private readonly startNode: Node;
  private readonly endNode: Node;
  private readonly totalCol: number;
  private readonly totalRow: number;
  constructor(grid: Grid, startNode: Node, endNode: Node) {
    this.grid = Utils.getNodesCopy(grid);
    const {totalRow, totalCol} = Utils.getGridSize(grid);
    this.totalCol = totalCol;
    this.totalRow = totalRow;
    this.startNode = startNode;
    this.endNode = endNode;
  }

  helper() {
    for (const node of this.grid.values()) {
      this.grid.set(`${node.getRowIdx()}-${node.getColumnIdx()}`, node.clone({weight: NodeWeights.WALL}));
    }
    this.generateMaze();

    this.grid.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.grid.set(Utils.getNodeKey(this.endNode), this.endNode);

    return this.grid;
  }

  private generateMaze() {
    const frontierArr: any = {};

    const randomCell = `${this.getRandomIdx(0, this.totalRow - 1)}-${this.getRandomIdx(0, this.totalCol - 1)}`;

    let initialCell = this.grid.get(randomCell)!;
    initialCell = initialCell.clone({weight: NodeWeights.EMPTY});
    this.grid.set(randomCell, initialCell);

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
      const {colIdx, rowIdx} = Utils.getNodeCoordinates(this.grid.get(neighborKey)!);

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
          && !this.grid.get(`${wr}-${wc}`)!.isWall()
        ) {
          neighbours[`${r}-${c}`] = `${r}-${c}`;
        }

        if (
          wr >= 0
          && wr <= this.totalRow -1
          && wc >= 0
          && wc <= this.totalCol - 1
          && this.grid.get(`${wr}-${wc}`)!.isWall()
        ) {
          frontierArr[`${wr}-${wc}`] = `${wr}-${wc}`;
        }
      });

      const randNeighbour = this.randomKey(neighbours);
      const randNeighborCopy = this.grid.get(randNeighbour)!.clone({weight: NodeWeights.EMPTY});
      const randFCopy = this.grid.get(neighborKey)!.clone({weight: NodeWeights.EMPTY});

      this.grid.set(randNeighbour, randNeighborCopy);
      this.grid.set(neighborKey, randFCopy);
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
