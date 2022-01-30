import {Dijkstra} from './dijkstra';
import {Node, NodeWeights} from '../../models/Node.class';
import {Grid, GridRow} from '../../models/grid.types';
import {SomeCustomMatchers} from '../utils/node-matcher';

// TODO :
//  - cover constructor
//  - cover traverse method
//  - extract logic for creating grid


// 0. Mark all nodes unvisited.
//    - Create a set of all the unvisited nodes
// 1. Assign to every node a tentative distance value:
//    - set it to zero for our initial node
//    - infinity for all other nodes
//    - Set the initial node as current
// 2. For the current node, consider all of its unvisited neighbors
//      - calculate their tentative distances through the current node
//      - Compare the newly calculated tentative distance to the current assigned value and assign the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbor B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.
// 3. When we are done considering all of the unvisited neighbors of the current node,
//    - mark the current node as visited
//    - remove it from the unvisited set
//    - A visited node will never be checked again
// 4. If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes),
//    - then stop. The algorithm has finished.
// 5. Otherwise, select the unvisited node that is marked with the smallest tentative distance
//    - set it as the new current node, and go back to step 3.

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
      let stubValue = 1;
      expect(Dijkstra.isFirstRow(stubValue)).toBeFalse();
    });

    it('should return true to rowIdx equal 0', () => {
      let stubValue = 0;
      expect(Dijkstra.isFirstRow(stubValue)).toBeTrue();
    });
  });

  describe('isLastRow', () => {
    it('should return false to rowIdx equal 1 and lastRowIdx equal 7', () => {
      let stubRowIdx = 1;
      let stubLastRowIdx = 10;
      expect(Dijkstra.isLastRow(stubRowIdx, stubLastRowIdx)).toBeFalse();
    });

    it('should return true to the rowIdx equal to lastRowIdx', () => {
      let stubRowIdx = 240;
      let stubLastRowIdx = 240;
      expect(Dijkstra.isLastRow(stubRowIdx, stubLastRowIdx)).toBeTrue();
    });
  });

  describe('isFirstColumn', () => {
    it('should return false for columnIdx equal 2', () => {
      let stubColIdx = 2;
      expect(Dijkstra.isFirstColumn(stubColIdx)).toBeFalse();
    });

    it('should return true for columnIdx equal 0', () => {
      let stubColIdx = 0;
      expect(Dijkstra.isFirstColumn(stubColIdx)).toBeTrue();
    });
  });

  describe('isLastColumn', () => {
    it('should return false for different columnIdx and lastColumnIdx', () => {
      let stubColIdx = 2;
      let stubLastColIdx = 7;
      expect(Dijkstra.isLastColumn(stubColIdx, stubLastColIdx)).toBeFalse();
    });

    it('should return true for the same columnIdx and lastColumnIdx', () => {
      let stubColIdx = 7;
      let stubLastColIdx = 7;
      expect(Dijkstra.isLastColumn(stubColIdx, stubLastColIdx)).toBeTrue();
    });
  });

  describe('sortNodesByDistance', () => {
    it('should sort array of Nodes by distance in ascending order', () => {
      // Construct stub values
      const ARRAY_SIZE = 10;
      let stubExpectedResult = Array(ARRAY_SIZE).fill(0).map((_, i) => i);

      let stubArr = Array(ARRAY_SIZE).fill(null).map((_, i) => new Node({
        colIdx: 1,
        rowIdx: 1,
        isFinishNode: false,
        isStartNode: false,
        distance: i
      }))

      // Testing
      Dijkstra.sortNodesByDistance(stubArr);

      const mappedArr = stubArr.map(node => node.distance);
      expect(mappedArr).toEqual(stubExpectedResult);
    })

    it('should leave empty array without changes', () => {
      let stubExpectedResult: GridRow = [];
      let stubArr: GridRow = [];

      Dijkstra.sortNodesByDistance(stubArr);

      expect(stubArr).toEqual(stubExpectedResult);
    })
  })

  describe('isNodeAccessible', () => {
    it('should return true for empty Node', () => {
      const stubNode = new Node({
        colIdx: 1,
        rowIdx: 1,
        isStartNode: false,
        isFinishNode: false,
        distance: NodeWeights.EMPTY
      });

      expect(Dijkstra.isNodeAccessible(stubNode)).toBeTrue();
    })

    it('should return false for Wall Node', () => {
      const stubNode = new Node({
        colIdx: 1,
        rowIdx: 1,
        isStartNode: false,
        isFinishNode: false,
        distance: NodeWeights.WALL
      });

      expect(Dijkstra.isNodeAccessible(stubNode)).toBeFalse();
    })
  })

  describe('traverse', () => {
    beforeEach(() => {
      jasmine.addMatchers(SomeCustomMatchers);
    });
    // return shortest path
    // don't return shortest path
    it('should return empty shortestPath', () => {
      const grid: Grid = new Array(6)
        .fill(null)
        .map(() => new Array(6).fill(null));

      const startNode = {colIdx: 2, rowIdx: 5};
      const endNode = {colIdx: 5, rowIdx: 0};
      const walls = [
        {colIdx: 0, rowIdx: 2},
        {colIdx: 1, rowIdx: 2},
        {colIdx: 2, rowIdx: 2},
        {colIdx: 3, rowIdx: 2},
        {colIdx: 4, rowIdx: 2},
        {colIdx: 5, rowIdx: 2},
        {colIdx: 5, rowIdx: 3},
        {colIdx: 5, rowIdx: 4},
        {colIdx: 5, rowIdx: 5}
      ];

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

      for (const keyEntry of walls) {
        grid[keyEntry.rowIdx][keyEntry.colIdx].setAsWall();
      }

      const [nodesToAnimate, shortestPath] = new Dijkstra({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx]
      })
        .traverse();

      // PRIO_Q
      let nodesToAnimateStub = [
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
        grid[3][4]
      ];

      nodesToAnimateStub = nodesToAnimateStub.map(node => {
        const nodeCopy = node.clone({});
        nodeCopy.setAsVisited();
        return nodeCopy;
      });

      expect(shortestPath).toReallyEqualVisitedNode([]);
      expect(nodesToAnimate).toReallyEqualVisitedNode(nodesToAnimateStub);
    });
    it('should return shortestPath', () => {
      const grid: Grid = new Array(6)
        .fill(null)
        .map(() => new Array(6).fill(null));

      const startNode = {colIdx: 2, rowIdx: 5};
      const endNode = {colIdx: 5, rowIdx: 0};

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

      const [nodesToAnimate, shortestPath] = new Dijkstra({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx]
      })
        .traverse();

      let nodesToAnimateStub = [
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
        grid[0][5]
      ];

      let shortestPathStub = [
        grid[4][2],
        grid[3][2],
        grid[2][2],
        grid[1][2],
        grid[0][2],
        grid[0][3],
        grid[0][4],
        grid[0][5]
      ]

      shortestPathStub = shortestPathStub.map(node => {
        const nodeCopy = node.clone({});
        nodeCopy.setAsVisited();
        return nodeCopy;
      });

      nodesToAnimateStub = nodesToAnimateStub.map(node => {
        const nodeCopy = node.clone({});
        nodeCopy.setAsVisited();
        return nodeCopy;
      });
      debugger
      expect(shortestPath).toReallyEqualVisitedNode(shortestPathStub);
      expect(nodesToAnimate).toReallyEqualVisitedNode(nodesToAnimateStub);
    });
  })
});
