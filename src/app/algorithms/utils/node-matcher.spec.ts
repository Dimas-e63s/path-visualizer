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

  describe('rowEquals', () => {
    it('it should return true for nodes with the same rowIdx\'s', () => {
      expect(NodeValidation.rowEquals(stubNode, stubNode)).toBeTrue();
    });

    it('it should return false for nodes with different rowIdx\'s', () => {
      expect(NodeValidation.rowEquals(stubNode, stubNode.clone({rowIdx: stubNode.getRowIdx() + 1}))).toBeFalse();
    });
  });

  describe('colEquals', () => {
    it('it should return true for nodes with different colIdx\'s', () => {
      expect(NodeValidation.colEquals(stubNode, stubNode.clone({colIdx: stubNode.getColumnIdx() + 1}))).toBeTrue();
    });

    it('it should return false for nodes with the same colIdx\'s', () => {
      expect(NodeValidation.colEquals(stubNode, stubNode)).toBeFalse();
    });
  })
})
