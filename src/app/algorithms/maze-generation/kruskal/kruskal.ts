import {Utils} from '../../utils/utils.class';
import {Node, NodeWeights} from '../../../models/Node.class';
import {Grid, GridMap} from '../../../models/grid.types';
import {Dijkstra} from '../../dijkstra/dijkstra';
import {DisjointSet} from '../../../data-structures/disjoint-set';
import {AlgorithmBase} from '../../algorithm-base/algorithm-base';

// TODO:
//  - add original mode (deleting walls)
//  - refactor for maze generation (adding walls)
//  - add last row and column for odd size

export class Kruskal extends AlgorithmBase{
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
    this.generateMaze2();

    this.gridMap.set(Utils.getNodeKey(this.startNode), this.startNode);
    this.gridMap.set(Utils.getNodeKey(this.endNode), this.endNode);
    return this.gridMap;
  }

  generateMaze2() {
    const set = new DisjointSet();
    const addedWalls = [];
    const removedWalls = [];
    let edges = [];

    for (const [key, node] of this.gridMap.entries()) {
      if (node.getColumnIdx() % 2 === 0 || node.getRowIdx() % 2 === 0) {
        if (
          !Dijkstra.isFirstColumn(node.getColumnIdx())
          && !Dijkstra.isFirstRow(node.getRowIdx())
          && !Dijkstra.isLastColumn(node.getColumnIdx(), this.totalCol - 1)
          && !Dijkstra.isLastRow(node.getRowIdx(), this.totalRow - 1)
        ) {
          edges.push(key);
        }
      } else {
        set.add(key);
      }
      node.setAsWall();
      addedWalls.push(key);
    }

    edges = this.randomSort(edges);

    edges.forEach(edge => {
      const [row, col] = edge.split('-');
      if (
        +row % 2 !== 0
        && !set.connected(set.get(`${row}-${+col - 1}`), set.get(`${row}-${+col + 1}`))
      ) {
        set.union(set.get(`${row}-${+col - 1}`), set.get(`${row}-${+col + 1}`))

        const node1 = this.gridMap.get(`${row}-${+col + 1}`)!.clone({weight: NodeWeights.EMPTY});
        const node2 = this.gridMap.get(`${row}-${+col - 1}`)!.clone({weight: NodeWeights.EMPTY});
        const node3 = this.gridMap.get(`${row}-${+col}`)!.clone({weight: NodeWeights.EMPTY});

        this.gridMap.set(`${row}-${+col + 1}`, node1);
        this.gridMap.set(`${row}-${+col - 1}`, node2);
        this.gridMap.set(`${row}-${+col}`, node3);
      }
      if (
        +col % 2 !== 0
        && !set.connected(set.get(`${+row - 1}-${col}`), set.get(`${+row + 1}-${col}`))
      ) {

        set.union(set.get(`${+row - 1}-${col}`), set.get(`${+row + 1}-${col}`))
        const node1 = this.gridMap.get(`${+row - 1}-${col}`)!.clone({weight: NodeWeights.EMPTY});
        const node2 = this.gridMap.get(`${+row + 1}-${col}`)!.clone({weight: NodeWeights.EMPTY});
        const node3 = this.gridMap.get(`${row}-${col}`)!.clone({weight: NodeWeights.EMPTY});

        this.gridMap.set(`${+row - 1}-${col}`, node1);
        this.gridMap.set(`${+row + 1}-${col}`, node2);
        this.gridMap.set(`${row}-${col}`, node3);
      }
    })
  }

  private randomSort(array: any[]) {
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
