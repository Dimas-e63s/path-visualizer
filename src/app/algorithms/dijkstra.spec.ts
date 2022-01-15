import {Utils, Dijkstra, GridNodeCoordinates} from './dijkstra';

describe('Dijkstra Class', () => {
  describe('isFirstRow', () => {
    it('should return false to 1 row', () => {
      let stubValue = 1;
      expect(Dijkstra.isFirstRow(stubValue)).toBeFalse();
      stubValue = 10;
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
});

describe('Utils Class', () => {
  describe('getNodeKey', () => {
    it('should return true for columnIdx 7 and 7 lastColumnIdx', () => {
      let stubNode: GridNodeCoordinates = {
        rowIdx: 10,
        columnIdx: 2,
      };
      expect(Utils.getNodeKey(stubNode)).toBe('10-2');
    });
  });
});
