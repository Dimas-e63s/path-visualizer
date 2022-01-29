import {Node} from '../../models/Node.class';
import {NodeValidation} from './node-matcher';

describe('NodeValidation', () => {
  let stubNode: Node;

  beforeEach(() => {
    stubNode = new Node({colIdx: 1, rowIdx: 1});
  });

  describe('isHasSameId', () => {
    it('it should return true for the same id', () => {
      expect(NodeValidation.isHasSameId(stubNode, stubNode)).toBeTrue();
    });

    it('it should return false nodes with diff ids', () => {
      expect(NodeValidation.isHasSameId(stubNode, stubNode.clone())).toBeFalse();
    });
  });

  describe('isHasDifferentRow', () => {
    it('it should return true for nodes with different rowIdx\'s', () => {
      expect(NodeValidation.isHasDifferentRow(stubNode, stubNode.clone({rowIdx: stubNode.getRowIdx() + 1}))).toBeTrue();
    });

    it('it should return false for nodes with the same rowIdx\'s', () => {
      expect(NodeValidation.isHasDifferentRow(stubNode, stubNode)).toBeFalse();
    });
  })

  describe('isHasDifferentCol', () => {
    it('it should return true for nodes with different colIdx\'s', () => {
      expect(NodeValidation.isHasDifferentCol(stubNode, stubNode.clone({colIdx: stubNode.getColumnIdx() + 1}))).toBeTrue();
    });

    it('it should return false for nodes with the same colIdx\'s', () => {
      expect(NodeValidation.isHasDifferentRow(stubNode, stubNode)).toBeFalse();
    });
  })
})
