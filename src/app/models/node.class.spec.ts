import {Node} from './Node.class';

// TODO: - search for other techniques for testing private methods

describe('Node', () => {
  let stubNode: Node;

  beforeEach(() => {
    stubNode = new Node({
      rowIdx: 1,
      colIdx: 1,
    });
  });

  describe('init logic', () => {
    it('should throw error for NaN rowIdx', () => {
      expect(() => stubNode.clone({rowIdx: NaN})).toThrow();
    });

    it('should throw error for NaN colIdx', () => {
      expect(() => stubNode.clone({colIdx: NaN})).toThrow();
    });

    it('should throw error for Node with coordinates set to NaN', () => {
      expect(() => stubNode.clone({colIdx: NaN, rowIdx: NaN})).toThrow();
    });

    it('should throw error for Infinity rowIdx', () => {
      expect(() => stubNode.clone({rowIdx: Infinity})).toThrow();
    });

    it('should throw error for Infinity colIdx', () => {
      expect(() => stubNode.clone({colIdx: Infinity})).toThrow();
    });

    it('should throw error for Node with coordinates set to Infinity', () => {
      expect(() => stubNode.clone({colIdx: Infinity, rowIdx: Infinity})).toThrow();
    });

    it('should throw error for negative rowIdx', () => {
      expect(() => stubNode.clone({rowIdx: -1})).toThrow();
    });

    it('should throw error for negative colIdx', () => {
      expect(() => stubNode.clone({colIdx: -1})).toThrow();
    });

    it('should throw error for Node with coordinates set to negative numbers', () => {
      expect(() => stubNode.clone({colIdx: -1, rowIdx: -1})).toThrow();
    });
  });

  describe('isValidNode', () => {
    it('should return false for startNode', () => {
      stubNode = stubNode.clone({isStartNode: true});

      // @ts-expect-error
      expect(stubNode.isEmptyNode()).toBeFalse();
    });

    it('should return false for endNode', () => {
      stubNode = stubNode.clone({isFinishNode: true});

      // @ts-expect-error
      expect(stubNode.isEmptyNode()).toBeFalse();
    });

    it('should return true for regular Node', () => {
      // @ts-expect-error
      expect(stubNode.isEmptyNode()).toBeTrue();
    });
  });

  describe('validateDestinationInput', () => {
    it('it should throw error for node with both startNode and endNode set to true', () => {
      // @ts-expect-error
      expect(() => stubNode.validateDestinationInput({isStartNode: true, isFinishNode: true})).toThrow();
    })
  });
});
