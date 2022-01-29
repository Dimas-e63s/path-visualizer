import {Node} from './Node.class';

// TODO: - search for other techniques for testing private methods

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

  describe('isValidNode', () => {
    let stubNode: Node;

    beforeEach(() => {
      stubNode = new Node({
        rowIdx: 1,
        colIdx: 1,
      });
    })
    it('should return false for startNode', () => {
      stubNode = stubNode.clone({isStartNode: true});

      // @ts-ignore
      expect(stubNode.isValidNode()).toBeFalse();
    });

    it('should return false for endNode', () => {
      stubNode = stubNode.clone({isFinishNode: true});

      // @ts-ignore
      expect(stubNode.isValidNode()).toBeFalse();
    });

    it('should return true for regular Node', () => {
      // @ts-ignore
      expect(stubNode.isValidNode()).toBeTrue();
    })
  });
});
