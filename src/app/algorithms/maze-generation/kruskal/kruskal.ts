import {Node} from '../../../models/Node.class';
import {Grid} from '../../../models/grid.types';
import {Dijkstra} from '../../dijkstra/dijkstra';
import {DisjointSet} from '../../../data-structures/disjoint-set';
import {MazeGeneration} from '../maze-generation';
import {DirectionsEnum} from '../../../models/maze-generation.enum';

// TODO:
//  - add original mode (deleting walls)
//  - refactor for maze generation (adding walls)
//  - add last row and column for odd size

export class Kruskal extends MazeGeneration {
  private readonly set: DisjointSet;

  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super(grid, startNode, endNode);
    this.set = new DisjointSet();
  }

  override generateMaze() {
    const verticalNeighbors: Readonly<DirectionsEnum[]> = [DirectionsEnum.N, DirectionsEnum.S];
    const horizontalNeighbors: Readonly<DirectionsEnum[]> = [DirectionsEnum.W, DirectionsEnum.E];

    this.randomSort(
      this.getListOfEdges(),
    ).forEach(edgeKey => {
      const {row, col} = this.parseNodeKey(edgeKey);
      if (this.isOdd(row) && !this.isNodeBelongToSet(edgeKey, horizontalNeighbors)) {
        this.makePassage(edgeKey, horizontalNeighbors);
      }

      if (this.isOdd(col) && !this.isNodeBelongToSet(edgeKey, verticalNeighbors)) {
        this.makePassage(edgeKey, verticalNeighbors);
      }
    });
  }

  private isNodeBelongToSet(node: string, directions: Readonly<DirectionsEnum[]>) {
    return this.set.connected(
      this.set.get(this.getNeighborKey(node, directions[0])),
      this.set.get(this.getNeighborKey(node, directions[1])),
    );
  }

  private makePassage(currNode: string, directions: Readonly<DirectionsEnum[]>) {
    const wallKey = this.getNeighborKey(currNode, directions[0]);
    const neighborKey = this.getNeighborKey(currNode, directions[1]);

    this.set.union(this.set.get(wallKey), this.set.get(neighborKey));

    this.gridMap.set(wallKey, this.getEmptyNode(wallKey));
    this.gridMap.set(neighborKey, this.getEmptyNode(neighborKey));
    this.gridMap.set(currNode, this.getEmptyNode(currNode));
  }

  private isOdd(num: number): boolean {
    return num % 2 === 1;
  }

  private getListOfEdges() {
    const edges = [];
    for (const [key, node] of this.gridMap.entries()) {
      if (!this.isOdd(node.getColumnIdx()) || !this.isOdd(node.getRowIdx())) {
        if (!this.isBorderNode(node)) {
          edges.push(key);
        }
      } else {
        this.set.add(key);
      }
    }

    return edges;
  }

  private isBorderNode(node: Node) {
    return Dijkstra.isFirstColumn(node.getColumnIdx())
      || Dijkstra.isFirstRow(node.getRowIdx())
      || Dijkstra.isLastColumn(node.getColumnIdx(), this.totalCol - 1)
      || Dijkstra.isLastRow(node.getRowIdx(), this.totalRow - 1);
  }
}
