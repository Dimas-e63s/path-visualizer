import {Dijkstra} from './dijkstra';
import {Node} from '../../models/Node.class';
import {Grid, GridRow} from '../../models/grid.types';
import {SomeCustomMatchers} from '../utils/node-matcher';

// TODO :
//  - cover constructor
//  - extract logic for creating grid

describe('Dijkstra Class', () => {
  describe('constructor', () => {
    // startNode -- can be null
    // endNode --can be null
    // they can be the same
    // grid can be empty
    // startNode can be outside of grid
    // endNode can be outside of grid
  });

  describe('isFirstRow', () => {
    it('should return false to rowIdx different than 0', () => {
      expect(Dijkstra.isFirstRow(1)).toBeFalse();
    });

    it('should return true to rowIdx equal 0', () => {
      expect(Dijkstra.isFirstRow(0)).toBeTrue();
    });
  });

  describe('isLastRow', () => {
    it('should return false to rowIdx equal 1 and lastRowIdx equal 7', () => {
      expect(Dijkstra.isLastRow(1, 10)).toBeFalse();
    });

    it('should return true to the rowIdx equal to lastRowIdx', () => {
      expect(Dijkstra.isLastRow(240, 240)).toBeTrue();
    });
  });

  describe('isFirstColumn', () => {
    it('should return false for columnIdx equal 2', () => {
      expect(Dijkstra.isFirstColumn(2)).toBeFalse();
    });

    it('should return true for columnIdx equal 0', () => {
      expect(Dijkstra.isFirstColumn(0)).toBeTrue();
    });
  });

  describe('isLastColumn', () => {
    it('should return false for different columnIdx and lastColumnIdx', () => {
      expect(Dijkstra.isLastColumn(2, 7)).toBeFalse();
    });

    it('should return true for the same columnIdx and lastColumnIdx', () => {
      expect(Dijkstra.isLastColumn(7, 7)).toBeTrue();
    });
  });

  describe('isNodeAccessible', () => {
    let stubNode: Node;
    beforeEach(() => {
      stubNode = new Node({
        colIdx: 1,
        rowIdx: 1,
        isStartNode: false,
        isFinishNode: false,
      });
    });

    it('should return true for empty Node', () => {
      expect(Dijkstra.isNodeAccessible(stubNode.clone({distance: 0}))).toBeTrue();
    });

    it('should return false for Wall Node', () => {
      expect(Dijkstra.isNodeAccessible(stubNode.clone({distance: Infinity}))).toBeFalse();
    });
  });

  describe('traverse', () => {
    let grid: Grid;
    const startNode = {colIdx: 2, rowIdx: 5};
    const endNode = {colIdx: 5, rowIdx: 0};
    const mapNodesToVisited = (grid: GridRow) => grid.map((node) => {
      const nodeCopy = node.clone({});
      nodeCopy.setAsVisited();
      return nodeCopy;
    });

    const mapNodeToShortestPath = (grid: GridRow) => grid.map((node) => node.clone({isShortestPath: true}));

    beforeEach(() => {
      jasmine.addMatchers(SomeCustomMatchers);
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

      const [nodesToAnimate, shortestPath] = new Dijkstra({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx],
      }).traverse();

      const nodesToAnimateStub = [
        grid[5][2],
        grid[4][2],
        grid[5][1],
        grid[5][3],
        grid[3][2],
        grid[4][1],
        grid[4][3],
        grid[5][0],
        grid[5][4],
        grid[3][1],
        grid[3][3],
        grid[4][0],
        grid[4][4],
        grid[3][0],
        grid[3][4],
      ];

      expect(shortestPath).toReallyEqualVisitedNode([]);
      expect(nodesToAnimate).toReallyEqualVisitedNode(
          mapNodesToVisited(nodesToAnimateStub),
      );
    });

    it('should return shortestPath', () => {
      const [nodesToAnimate, shortestPath] = new Dijkstra({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx],
      }).traverse();

      const nodesToAnimateStub = [
        grid[5][2],
        grid[4][2],
        grid[5][1],
        grid[5][3],
        grid[3][2],
        grid[4][1],
        grid[4][3],
        grid[5][0],
        grid[5][4],
        grid[2][2],
        grid[3][1],
        grid[3][3],
        grid[4][0],
        grid[4][4],
        grid[5][5],
        grid[1][2],
        grid[2][1],
        grid[2][3],
        grid[3][0],
        grid[3][4],
        grid[4][5],
        grid[0][2],
        grid[1][1],
        grid[1][3],
        grid[2][0],
        grid[2][4],
        grid[3][5],
        grid[0][1],
        grid[0][3],
        grid[1][0],
        grid[1][4],
        grid[2][5],
        grid[0][0],
        grid[0][4],
        grid[1][5],
        grid[0][5],
      ];

      const shortestPathStub = [
        grid[4][2],
        grid[3][2],
        grid[2][2],
        grid[1][2],
        grid[0][2],
        grid[0][3],
        grid[0][4],
        grid[0][5],
      ];

      expect(shortestPath).toReallyEqualAnimationNode(
          mapNodeToShortestPath(shortestPathStub),
      );
      expect(nodesToAnimate).toReallyEqualVisitedNode(
          mapNodesToVisited(nodesToAnimateStub),
      );
    });
  });
});
