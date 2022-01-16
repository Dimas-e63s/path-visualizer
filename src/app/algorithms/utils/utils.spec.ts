import {Utils} from './utils.class';
import {Node, NodeInterface} from '../../models/Node.class';
import {Grid, GridMap, GridRow} from '../../models/grid.types';

// TODO: - empty GridMap, no node in GridMap (getNodeBelow etc.)

describe('Utils Class', () => {
  let emptyGrid: Grid;
  let createNode: (metaData: NodeInterface) => Node;

  beforeEach(() => {
    emptyGrid = [];

    createNode = (metaData) => new Node({
      ...metaData
    });
  });

  describe('getNodeKey', () => {
    it('should return true for columnIdx 7 and 7 lastColumnIdx', () => {
      let stubNode: Node = new Node({
        rowIdx: 2,
        colIdx: 10,
      });

      expect(Utils.getNodeKey(stubNode)).toBe('2-10');
    });
  });

  describe('getGridRowSize', () => {
    it('should return amount of rows', () => {
      expect(Utils.getGridRowSize(emptyGrid)).toEqual(0);

      const stubGrid: Grid = Array(50).fill(null).map(() => []);
      expect(Utils.getGridRowSize(stubGrid)).toEqual(50);
    });
  });

  describe('getGridColumnSize', () => {
    it('should return column size', () => {
      expect(Utils.getGridColumnSize(emptyGrid)).toEqual(0);

      let stubGrid: Grid = Array(50)
        .fill(null)
        .map(() => []);
      expect(Utils.getGridColumnSize(stubGrid)).toEqual(0);

      // @ts-ignore
      stubGrid = Array(50)
        .fill(null)
        .map((_, idx) => [
            new Node({
              colIdx: idx,
              rowIdx: idx,
            }),
          ],
        );

      expect(Utils.getGridColumnSize(stubGrid)).toEqual(1);
    });
  });

  describe('getNodesCopy', () => {
    beforeEach(() => {
      const nodeClassMatcher = (a: Node, b: Node) => {
        return a.id !== b.id
          && a.getColumnIdx() === b.getColumnIdx()
          && a.getRowIdx() === b.getRowIdx()
          && a.getIsFinishNode() === b.getIsFinishNode()
          && a.getIsStartNode() === b.getIsStartNode()
          && a.distance === b.distance
          && a.previousNode === b.previousNode
          && a.weight === b.weight;
      }

      jasmine.addCustomEqualityTester(nodeClassMatcher);
    })
    it('should return empty hash-map', () => {
      let stubVal: Grid = [];

      expect(Utils.getNodesCopy(stubVal)).toHaveSize(0);
    });

    it('should return hash-map with 3 Node', () => {
      const gridRow: GridRow = Array(3).fill(0).map((_, idx) => new Node({
        colIdx: idx,
        rowIdx: idx,
        isFinishNode: false,
        isStartNode: false,
        distance: 1
      }));

      const [stubNode1, stubNode2, stubNode3] = gridRow;
      const clonedGrid = Utils.getNodesCopy([gridRow]);
      const [clonedNode1, clonedNode2, clonedNode3] = clonedGrid.values();

      expect(clonedGrid).toHaveSize(3);
      expect(clonedNode1).toEqual(stubNode1);
      expect(clonedNode2).toEqual(stubNode2);
      expect(clonedNode3).toEqual(stubNode3);
    })
  });

  describe('isEndNode', () => {
    it('should return true', () => {
      let nodeMetadata = {rowIdx: 0, colIdx: 0};

      let currNode = createNode(nodeMetadata);
      let endNode = createNode(nodeMetadata);
      expect(Utils.isEndNode(currNode, endNode)).toBeTrue();

      nodeMetadata = {rowIdx: 25, colIdx: 34};

      currNode = createNode(nodeMetadata);
      endNode = createNode(nodeMetadata);

      expect(Utils.isEndNode(currNode, endNode)).toBeTrue();
    })

    it('should return false', () => {
      let nodeMetadata = {rowIdx: 10, colIdx: 0};
      let endNodeMetadata = {rowIdx: 10, colIdx: 45};

      let currNode = createNode(nodeMetadata);
      let endNode = createNode(endNodeMetadata);

      expect(Utils.isEndNode(currNode, endNode)).toBeFalse();

      nodeMetadata = {rowIdx: 34, colIdx: 21};
      endNodeMetadata = {rowIdx: 11, colIdx: 12};

      currNode = createNode(nodeMetadata);
      endNode = createNode(endNodeMetadata);

      expect(Utils.isEndNode(currNode, endNode)).toBeFalse();
    })
  });

  describe('isPreviousNodeExist', () => {
    let stubPrevNode: Node;

    beforeEach(() => {
      stubPrevNode = createNode({
        colIdx: 2,
        rowIdx: 10
      });
    })

    it('should return false', () => {
      expect(Utils.isPreviousNodeExist(stubPrevNode)).toBeFalse();
    });

    it('should return true', () => {
      const stubNode = new Node({
        colIdx: 34,
        rowIdx: 34,
        previousNode: stubPrevNode
      })

      expect(Utils.isPreviousNodeExist(stubNode)).toBeTrue();
    })
  });

  describe('getNodesInShortestPathOrder', () => {
    it('should return empty array', () => {
      let endNode = createNode({rowIdx: 12, colIdx: 12});

      expect(Utils.getNodesInShortestPathOrder(endNode)).toEqual([]);
    })

    it('should return shortest path array', () => {
      let startNode = createNode({rowIdx: 22, colIdx: 12});
      let endNode = createNode({rowIdx: 12, colIdx: 12, previousNode: startNode});
      expect(Utils.getNodesInShortestPathOrder( endNode)).toEqual([endNode]);
    })
  });

  describe('getNodeCoordinates', () => {
    it('it should return coordinates', () => {
      const nodeMetaData = {colIdx: 10, rowIdx: 10};
      const stubNode = createNode(nodeMetaData);
      expect(Utils.getNodeCoordinates(stubNode)).toEqual(nodeMetaData);
    })
  });

  describe('getBelowNode', () => {
    it('should return node one row below current node', () => {
      const currentRow = 10;
      const currentNode = createNode({rowIdx: currentRow, colIdx: 9});
      const nodeBelow = createNode({rowIdx: currentRow - 1, colIdx: 9});
      const grid: GridMap = new Map([
        [Utils.getNodeKey(nodeBelow), nodeBelow]
      ]);

      expect(Utils.getBelowNode(currentNode, grid)).toEqual(nodeBelow);
    })
  });

  describe('getLeftNode', () => {
    it('should return node one column left of current node', () => {
      const currentColumn = 10;
      const currentNode = createNode({rowIdx: 10, colIdx: currentColumn});
      const leftNode = createNode({rowIdx: 10, colIdx: currentColumn - 1});
      const grid: GridMap = new Map([
        [Utils.getNodeKey(leftNode), leftNode]
      ]);

      expect(Utils.getLeftNode(currentNode, grid)).toEqual(leftNode);
    })
  });

  describe('getUpNode', () => {
    it('should return node one level above of current node', () => {
      const currentColumn = 10;
      const currentNode = createNode({rowIdx: 10, colIdx: currentColumn});
      const upNode = createNode({rowIdx: 10, colIdx: currentColumn + 1});
      const grid: GridMap = new Map([
        [Utils.getNodeKey(upNode), upNode]
      ]);

      expect(Utils.getUpNode(currentNode, grid)).toEqual(upNode);
    })
  });

  describe('getRightNode', () => {
    it('should return right node of current node', () => {
      const currentRow = 10;
      const currentNode = createNode({rowIdx: currentRow, colIdx: 9});
      const rightNode = createNode({rowIdx: currentRow + 1, colIdx: 9});
      const grid: GridMap = new Map([
        [Utils.getNodeKey(rightNode), rightNode]
      ]);

      expect(Utils.getRightNode(currentNode, grid)).toEqual(rightNode);
    })
  });
});
