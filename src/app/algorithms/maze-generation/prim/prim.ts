import {Grid} from '../../../models/grid.types';
import {Node} from '../../../models/Node.class';
import {directions} from '../../../models/maze-generation.enum';
import {MazeGeneration} from '../maze-generation';

export class Prim extends MazeGeneration {
  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super(grid, startNode, endNode);
  }

  override generateMaze() {
    const frontierArr: any = {};

    this.mark(
      `${this.getRandomIdx(0, this.totalRow - 1)}-${this.getRandomIdx(0, this.totalCol - 1)}`,
      frontierArr
    );

    while (Object.keys(frontierArr).length > 0) {
      const randomKey = this.randomKey(frontierArr);
      delete frontierArr[randomKey];

      this.mark(randomKey, frontierArr)

      const neighbourKey = this.randomKey(this.getNeighbors(randomKey));
      this.gridMap.set(neighbourKey, this.getEmptyNode(neighbourKey));
    }
  }

  private mark(currNode: string, frontierArr: any) {
    directions.forEach(direction => {
      const neighborKey = this.getNeighborKey(
        this.getNeighborKey(currNode, direction),
        direction,
      );

      if (this.gridMap.has(neighborKey) && this.gridMap.get(neighborKey)!.isWall()) {
        frontierArr[neighborKey] = neighborKey;
      }
    });

    this.gridMap.set(currNode, this.getEmptyNode(currNode));
  }

  private getNeighbors(nodeKey: string) {
    const neighbours: any = {};
    directions.forEach(direction => {
      const wallKey = this.getNeighborKey(nodeKey, direction);
      const neighborKey = this.getNeighborKey(wallKey, direction);

      if (
        this.gridMap.has(neighborKey)
        && !this.gridMap.get(neighborKey)!.isWall()
      ) {
        neighbours[wallKey] = wallKey;
      }
    });

    return neighbours;
  }

  private getRandomIdx(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomKey(obj: any) {
    const keys = Object.keys(obj);
    return keys[(keys.length * Math.random()) << 0];
  };
}
