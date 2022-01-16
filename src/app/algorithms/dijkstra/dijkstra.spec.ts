import {Dijkstra} from './dijkstra';
import {Node, NodeWeights} from '../../models/Node.class';
import {GridRow} from '../../models/grid.types';

// TODO :
//  - cover constructor
//  - cover traverse method

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
    it('should return false to 1 row', () => {
      let stubValue = 1;
      expect(Dijkstra.isFirstRow(stubValue)).toBeFalse();

      stubValue = 10;
      expect(Dijkstra.isFirstRow(stubValue)).toBeFalse();

      stubValue = 2345;
      expect(Dijkstra.isFirstRow(stubValue)).toBeFalse();
    });

    it('should return true to 0 row', () => {
      let stubValue = 0;
      expect(Dijkstra.isFirstRow(stubValue)).toBeTrue();
    });
  });

  describe('isLastRow', () => {
    it('should return false to 1 rowIdx and 7 lastRowIdx', () => {
      let stubRowIdx = 1;
      let stubLastRowIdx = 10;
      expect(Dijkstra.isLastRow(stubRowIdx, stubLastRowIdx)).toBeFalse();
      stubRowIdx = 10;
      stubLastRowIdx = 1000;
      expect(Dijkstra.isLastRow(stubRowIdx, stubLastRowIdx)).toBeFalse();
    });

    it('should return true to the same rowIdx', () => {
      let stubRowIdx = 1;
      let stubLastRowIdx = 1;
      expect(Dijkstra.isLastRow(stubRowIdx, stubLastRowIdx)).toBeTrue();

      stubRowIdx = 240;
      stubLastRowIdx = 240;
      expect(Dijkstra.isLastRow(stubRowIdx, stubLastRowIdx)).toBeTrue();
    });
  });

  describe('isFirstColumn', () => {
    it('should return false for columnIdx 2', () => {
      let stubColIdx = 2;
      expect(Dijkstra.isFirstColumn(stubColIdx)).toBeFalse();
    });

    it('should return true for columnIdx 0', () => {
      let stubColIdx = 0;
      expect(Dijkstra.isFirstColumn(stubColIdx)).toBeTrue();
    });
  });

  describe('isLastColumn', () => {
    it('should return false for columnIdx 2 and 7 lastColumnIdx', () => {
      let stubColIdx = 2;
      let stubLastColIdx = 7;
      expect(Dijkstra.isLastColumn(stubColIdx, stubLastColIdx)).toBeFalse();
    });

    it('should return true for columnIdx 7 and 7 lastColumnIdx', () => {
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

    it('should not sort empty array', () => {
      let stubExpectedResult: GridRow = [];
      let stubArr: GridRow = [];

      Dijkstra.sortNodesByDistance(stubArr);

      expect(stubArr).toEqual(stubExpectedResult);
    })
  })

  describe('isNodeAccessible', () => {
    it('should return true', () => {
      const stubNode = new Node({
        colIdx: 1,
        rowIdx: 1,
        isStartNode: false,
        isFinishNode: false,
        distance: NodeWeights.EMPTY
      });

      expect(Dijkstra.isNodeAccessible(stubNode)).toBeTrue();
    })

    it('should return false', () => {
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

  })
});
