import {Grid, GridRow} from '../../models/grid.types';
import {SomeCustomMatchers} from '../utils/node-matcher';
import {Node} from '../../models/Node.class';
import {UnweightedAlgorithms} from './unweighted-algorithms';
import {Utils} from '../utils/utils.class';

describe('UnweightedAlgorithms', () => {
  let grid: Grid;
  let startNode: any;
  const endNode = {colIdx: 5, rowIdx: 0};
  const mapNodesToVisited = (grid: GridRow) => grid.map(node => {
    const nodeCopy = node.clone({});
    nodeCopy.setAsVisited();
    return nodeCopy;
  });
  beforeEach(() => {
    jasmine.addMatchers(SomeCustomMatchers);
    startNode = {colIdx: 2, rowIdx: 5};

    grid = new Array(6)
      .fill(null)
      .map(() => new Array(6).fill(null));

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        grid[row][col] = new Node({
          rowIdx: row,
          colIdx: col,
          isStartNode: startNode.colIdx === col && startNode.rowIdx === row,
          isFinishNode: endNode.colIdx === col && endNode.rowIdx === row,
        });
      }
    }
  });

  describe('dfs', () => {
    // Grid * Node * Node --> [Node[], Node[]]
    // return empty path --> 15 explored Nodes
    // return non-empty path
    it('should return empty shortestPath', () => {
      const walls = [
        {colIdx: 0, rowIdx: 2},
        {colIdx: 1, rowIdx: 2},
        {colIdx: 2, rowIdx: 2},
        {colIdx: 3, rowIdx: 2},
        {colIdx: 4, rowIdx: 2},
        {colIdx: 5, rowIdx: 2},
        {colIdx: 5, rowIdx: 3},
        {colIdx: 5, rowIdx: 4},
        {colIdx: 5, rowIdx: 5},
      ];

      for (const keyEntry of walls) {
        grid[keyEntry.rowIdx][keyEntry.colIdx].setAsWall();
      }

      const [nodesToAnimate, shortestPath] = new UnweightedAlgorithms().dfs({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx],
      });

      const nodesToAnimateStub = [
        grid[5][2],
        grid[4][2],
        grid[3][2],
        grid[3][3],
        grid[3][4],
        grid[4][4],
        grid[5][4],
        grid[5][3],
        grid[4][3],
        grid[3][1],
        grid[4][1],
        grid[5][1],
        grid[5][0],
        grid[4][0],
        grid[3][0],
      ];

      expect(shortestPath).toReallyEqualVisitedNode([]);
      expect(nodesToAnimate).toReallyEqualVisitedNode(
        mapNodesToVisited(nodesToAnimateStub),
      );
    });

    it('should return non-empty shortestPath', () => {
      const [nodesToAnimate, shortestPath] = new UnweightedAlgorithms().dfs({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx],
      });

      const nodesToAnimateStub = [
        grid[5][2],
        grid[4][2],
        grid[3][2],
        grid[2][2],
        grid[1][2],
        grid[0][2],
        grid[0][3],
        grid[0][4],
        grid[0][5],
      ];

      let shortestPathStub = [
        grid[4][2],
        grid[3][2],
        grid[2][2],
        grid[1][2],
        grid[0][2],
        grid[0][3],
        grid[0][4],
        grid[0][5],
      ];

      expect(shortestPath).toReallyEqualVisitedNode(
        mapNodesToVisited(shortestPathStub),
      );
      expect(nodesToAnimate).toReallyEqualVisitedNode(
        mapNodesToVisited(nodesToAnimateStub),
      );
    });
  });
});
