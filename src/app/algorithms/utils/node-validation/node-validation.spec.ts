import {Node, NodeWeights} from '../../../models/Node.class';
import {NodeValidation} from './node-validation';

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
    it('it should return true for nodes with the same colIdx\'s', () => {
      expect(NodeValidation.colEquals(stubNode, stubNode)).toBeTrue();
    });

    it('it should return false for nodes with different colIdx\'s', () => {
      expect(NodeValidation.colEquals(stubNode, stubNode.clone({colIdx: stubNode.getColumnIdx() + 1}))).toBeFalse();
    });
  });

  describe('weightEquals', () => {
    it('should return true for nodes with the same weight\'s', () => {
      expect(NodeValidation.weightEquals(stubNode, stubNode)).toBeTrue();
    });

    it('it should return false for nodes with different weight\'s', () => {
      expect(NodeValidation.weightEquals(stubNode, stubNode.clone({weight: NodeWeights.WALL}))).toBeFalse();
    });
  });

  describe('visitedNodesEqual', () => {
    it('should return true for both nodes set as visited', () => {
      stubNode.setAsVisited();
      expect(NodeValidation.visitedNodesEqual(stubNode, stubNode)).toBeTrue()
    });

    it('should return true for both nodes set as visited', () => {
      const unvisitedNode = stubNode.clone();
      stubNode.setAsVisited();

      expect(NodeValidation.visitedNodesEqual(stubNode, unvisitedNode)).toBeFalse()
    });
  });

  describe('isNodeCopy', () => {
    it('should return false for nodes with the same id\'s', () => {
      expect(NodeValidation.isVisitedNodeCopy(stubNode, stubNode)).toBeFalse();
    });

    it('should return false for nodes with the diff rowIdx\'s', () => {
      expect(NodeValidation.isVisitedNodeCopy(stubNode, stubNode.clone({rowIdx: stubNode.getRowIdx() + 1}))).toBeFalse();
    });

    it('should return false for nodes with the diff colIdx\'s', () => {
      expect(NodeValidation.isVisitedNodeCopy(stubNode, stubNode.clone({colIdx: stubNode.getColumnIdx() + 1}))).toBeFalse();
    });

    it('should return false for nodes with the diff weight\'s', () => {
      expect(NodeValidation.isVisitedNodeCopy(stubNode, stubNode.clone({weight: NodeWeights.WALL}))).toBeFalse();
    });

    it('should return false for nodes with the diff visited states', () => {
      const unvisitedNode = stubNode.clone();
      stubNode.setAsVisited();
      expect(NodeValidation.isVisitedNodeCopy(stubNode, unvisitedNode)).toBeFalse();
    });

    it('should return true for nodes with the same coordinates, weights, visitedState', () => {
      const nodeClone = stubNode.clone();
      nodeClone.setAsVisited();
      stubNode.setAsVisited();
      expect(NodeValidation.isVisitedNodeCopy(stubNode, nodeClone)).toBeTrue();
    });
  });

  describe('isEqualSize', () => {
    it('should return true for GridRow\'s with the same size', () => {
      expect(NodeValidation.isEqualSize([stubNode], [stubNode])).toBeTrue();
    });

    it('should return false for GridRow\'s with the different size\'s',  () => {
      expect(NodeValidation.isEqualSize([stubNode], [])).toBeFalse();
    })
  });
});
