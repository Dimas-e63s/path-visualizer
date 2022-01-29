import {Node} from './Node.class';

describe('Node', () => {
  describe('init logic', () => {
    it('should validate rowIdx and colIdx for NaN', () => {
      expect(() => new Node({
        rowIdx: NaN,
        colIdx: 1,
      })).toThrow();

      expect(() => new Node({
        rowIdx: 10,
        colIdx: NaN,
      })).toThrow();

      expect(() => new Node({
        rowIdx: NaN,
        colIdx: NaN,
      }));
    });
    it('should validate rowIdx and colIdx for Infinity', () => {
      expect(() => new Node({
        rowIdx: Infinity,
        colIdx: 1,
      })).toThrow();

      expect(() => new Node({
        rowIdx: 10,
        colIdx: Infinity,
      })).toThrow();

      expect(() => new Node({
        rowIdx: Infinity,
        colIdx: Infinity,
      })).toThrow();
    });
    it('should validate rowIdx and colIdx for negative values', () => {
      expect(() => new Node({
        rowIdx: -1,
        colIdx: 1,
      })).toThrow();

      expect(() => new Node({
        rowIdx: 10,
        colIdx: -1,
      })).toThrow();

      expect(() => new Node({
        rowIdx: -1,
        colIdx: -1,
      })).toThrow();
    });
  });
});
