import {Backtracking} from './backtracking';
import {GridBuilder} from '../../../grid-builder';
import {DirectionsEnum} from '../../../models/maze-generation.enum';
import {Grid} from '../../../models/grid.types';
import {Node} from '../../../models/Node.class';

class BacktrackingStub extends Backtracking {
  constructor(grid: Grid, startNode: Node, endNode: Node) {
    super(grid, startNode, endNode);
  }
}

describe('Backtracking class', () => {
  let backtrackingObj: BacktrackingStub;

  beforeEach(() => {
    const grid = GridBuilder.generateGrid({row: 10, col: 10});
    backtrackingObj = new BacktrackingStub(
      grid,
      grid[0][0],
      grid[9][9],
    );
  });

  // what if empty grid will be passed???
  describe('transformToWalls', () => {
    it('should transform passed grid to walls', () => {
      // @ts-expect-error
      backtrackingObj.transformToWalls();
      // @ts-expect-error
      backtrackingObj.gridMap.forEach(node => {
        expect(node.isWall()).toBeTrue();
      });
    });
  });

  // what if no Node found???
  describe('getEmptyNode', () => {
    it('should reset Node weight to EMPTY', () => {
      const TEST_NODE_KEY = '0-0';
      // @ts-expect-error
      backtrackingObj.gridMap.get(TEST_NODE_KEY)!.setAsWall();
      // @ts-expect-error
      expect(backtrackingObj.getEmptyNode(TEST_NODE_KEY).isWall()).toBeFalse();
    });
  });

  describe('makePassage', () => {
    it('should remove wall and add node to visitedNodes', () => {
      const TEST_NODE_KEY = '0-0';
      // @ts-expect-error
      backtrackingObj.gridMap.get(TEST_NODE_KEY)!.setAsWall();
      // @ts-expect-error
      expect(backtrackingObj.visitedNodes.has(TEST_NODE_KEY)).toBeFalse();
      // @ts-expect-error
      expect(backtrackingObj.gridMap.get(TEST_NODE_KEY).isWall()).toBeTrue();

      // @ts-expect-error
      backtrackingObj.makePassage(TEST_NODE_KEY);

      // @ts-expect-error
      expect(backtrackingObj.visitedNodes.has(TEST_NODE_KEY)).toBeTrue();
      // @ts-expect-error
      expect(backtrackingObj.gridMap.get(TEST_NODE_KEY).isWall()).toBeFalse();
    });
  });

  // can be destructed with NaN
  describe('parseNodeKey', () => {
    // given string Node key return number representation
    it('should return parsed number representation of key', () => {
      // @ts-expect-error
      expect(backtrackingObj.parseNodeKey('0-0')).toEqual({rowIdx: 0, colIdx: 0});
    });
  });

  describe('getNeighborKey', () => {
    it('should return Node key of the neighbor oen level below', () => {
      // @ts-expect-error
      expect(backtrackingObj.getNeighborKey('0-0', DirectionsEnum.S)).toEqual('1-0');
    });
  });

  describe('getNeighborColIdx', () => {
    // coldIdx: number, direction: DirectionEnum
    it('should return colIdx without changes', () => {
      // @ts-expect-error
      expect(Backtracking.getNeighborColIdx(0, DirectionsEnum.N)).toEqual(0);
      // @ts-expect-error
      expect(Backtracking.getNeighborColIdx(0, DirectionsEnum.S)).toEqual(0);
    });

    it('should return colIdx decremented by 1', () => {
      // @ts-expect-error
      expect(Backtracking.getNeighborColIdx(0, DirectionsEnum.W)).toEqual(-1);
    });

    it('should return colIdx incremented by 1', () => {
      // @ts-expect-error
      expect(Backtracking.getNeighborColIdx(0, DirectionsEnum.E)).toEqual(1);
    });
  });

  describe('getNeighborRowIdx', () => {
    // given rowIdx and direction should return rowIdx changed by direction value
    it('should return rowIdx without changes', () => {
      // @ts-expect-error
      expect(Backtracking.getNeighborRowIdx(0, DirectionsEnum.W)).toEqual(0);
      // @ts-expect-error
      expect(Backtracking.getNeighborRowIdx(0, DirectionsEnum.E)).toEqual(0);
    });

    it('should return rowIdx incremented by 1', () => {
      // @ts-expect-error
      expect(Backtracking.getNeighborRowIdx(0, DirectionsEnum.S)).toEqual(1);
    });

    it('should return rowIdx decremented by 1', () => {
      // @ts-expect-error
      expect(Backtracking.getNeighborRowIdx(0, DirectionsEnum.N)).toEqual(-1);
    });
  });

  describe('isUnvisitedNode', () => {
    // should check if node exist in grid, if it was visited, if wall was visited
    // true
    // false
    // string * string
    it('should return false for Node that not exist in grid', () => {
      // @ts-expect-error
      expect(backtrackingObj.isUnvisitedNode({neighborKey: '12-0', wallKey: '11-0'})).toBeFalse();
    });

    it('should return false for Node that was visited', () => {
      // @ts-expect-error
      backtrackingObj.visitedNodes.add('12-0');
      // @ts-expect-error
      expect(backtrackingObj.isUnvisitedNode({neighborKey: '12-0', wallKey: '11-0'})).toBeFalse();
    });

    it('should return true for Node was not visited and exist in grid', () => {
      // @ts-expect-error
      expect(backtrackingObj.isUnvisitedNode({neighborKey: '9-0', wallKey: '8-0'})).toBeTrue();
    });
  });

  describe('generateMaze', () => {
    it('should throw error', () => {
      expect(() => backtrackingObj.getMaze()).toThrow();
    })
  });
});
