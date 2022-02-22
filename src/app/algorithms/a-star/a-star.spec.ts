import {AStar} from './a-star';
import {Grid} from '../../models/grid.types';
import {Node, NodeInterface, NodeWeights} from '../../models/Node.class';
import {Utils} from '../../utils/utils.class';
import PriorityQueue from '../../data-structures/prio';
import {SomeCustomMatchers} from '../../utils/node-matcher';

describe('AStar', () => {
  let emptyGrid: Grid;
  let createNode: (metaData: NodeInterface) => Node;

  beforeEach(() => {
    emptyGrid = [];

    createNode = (metaData) => new Node({
      ...metaData,
    });
  });

  describe('getPointsDistance', () => {
    it('should return absolute difference between two points', () => {
      const stubX = 23;
      const stubY = 40;

      expect(AStar.getPointsDistance(stubX, stubY)).toEqual(17);
    });

    it('should return 0 for stating point', () => {
      const stubX = 0;
      const stubY = 0;

      expect(AStar.getPointsDistance(stubX, stubY)).toEqual(0);
    });
  });

  describe('calculateHeuristic', () => {
    it('should return heuristic between two Nodes', () => {
      const stubCurrentNode = createNode({rowIdx: 10, colIdx: 10});
      const stubEndNode = createNode({rowIdx: 40, colIdx: 38});
      const COMPARE_PRECISION = 6;

      expect(AStar.calculateHeuristic({
        currentNode: stubCurrentNode,
        endNode: stubEndNode,
      })).toBeCloseTo(58.058, COMPARE_PRECISION);
    });

    it('should return heuristic equal to 0', () => {
      const stubCurrentNode = createNode({rowIdx: 10, colIdx: 10});
      expect(AStar.calculateHeuristic({
        currentNode: stubCurrentNode,
        endNode: stubCurrentNode,
      })).toEqual(0);
    });
  });

  describe('populateMapsWithDefaultValues', () => {
    it('should populate gScore and fScore with default values', () => {
      let gScore = new Map<string, number>();
      let fScore = new Map<string, number>();
      let gridMap = Utils.getNodesCopy(emptyGrid);

      AStar.populateMapsWithDefaultValues({
        gScore,
        fScore,
        grid: gridMap,
      });

      expect(gScore).toHaveSize(0);
      expect(fScore).toHaveSize(0);

      gScore = new Map<string, number>();
      fScore = new Map<string, number>();

      const stubGrid = [
        [
          createNode({rowIdx: 0, colIdx: 0}),
          createNode({rowIdx: 0, colIdx: 1}),
        ],
      ];
      const gridRowSize = stubGrid[0].length;
      gridMap = Utils.getNodesCopy(stubGrid);

      const firstNode = stubGrid[0][0];
      const firstNodeKey = Utils.getNodeKey(firstNode);

      const secondNode = stubGrid[0][1];
      const secondNodeKey = Utils.getNodeKey(secondNode);

      AStar.populateMapsWithDefaultValues({
        gScore,
        fScore,
        grid: gridMap,
      });

      expect(gScore).toHaveSize(gridRowSize);
      expect(gScore.get(firstNodeKey)).toEqual(Infinity);
      expect(gScore.get(secondNodeKey)).toEqual(Infinity);

      expect(fScore).toHaveSize(gridRowSize);
      expect(fScore.get(firstNodeKey)).toEqual(Infinity);
      expect(fScore.get(secondNodeKey)).toEqual(Infinity);
    });
  });

  describe('isInvalidNode', () => {
    it('should return false for visited wall', () => {
      const stubNode = createNode({rowIdx: 10, colIdx: 12});
      stubNode.setAsVisited();

      expect(AStar.isInvalidNode(stubNode)).toBeTrue();
    });

    it('should return true for wall Node', () => {
      const stubNode = createNode({rowIdx: 23, colIdx: 12, weight: NodeWeights.WALL});

      expect(AStar.isInvalidNode(stubNode)).toBeTrue();
    });

    it('should return false for empty Node', () => {
      const stubNode = createNode({rowIdx: 23, colIdx: 23});

      expect(AStar.isInvalidNode(stubNode)).toBeFalse();
    });
  });

  describe('setStartNode', () => {
    // set distance for starting node populate queue
    // string * Map * Map * Queue * Node * Node --> void

    it('should set startNode within gScore, fScore and Queue', () => {
      const fScore = new Map<string, number>();
      const gScore = new Map<string, number>();
      const prioQ = new PriorityQueue();
      const startNode = createNode({colIdx: 0, rowIdx: 0});
      const endNode = createNode({colIdx: 12, rowIdx: 11});
      const startNodeKey = Utils.getNodeKey(startNode);

      AStar.setStartNode({
        startNodeKey,
        startNode,
        endNode,
        fScore,
        gScore,
        prioQ,
      });

      expect(fScore).toHaveSize(1);
      expect(fScore.get(startNodeKey)).toEqual(AStar.calculateHeuristic({currentNode: startNode, endNode}));

      expect(gScore).toHaveSize(1);
      expect(gScore.get(startNodeKey)).toEqual(0);

      expect(prioQ.hasValue(startNodeKey)).toBeTrue();
    });
  });

  describe('isNeighborHasCloserPath', () => {
    let startNode: Node;
    let stubNode: Node;
    let gScore: Map<string, number>;

    beforeEach(() => {
      startNode = createNode({colIdx: 0, rowIdx: 10});
      stubNode = createNode({colIdx: 10, rowIdx: 10});

      gScore = new Map<string, number>([
        [Utils.getNodeKey(startNode), 0],
        [Utils.getNodeKey(stubNode), Infinity],
      ]);
    });

    it('should return true for Node with closest path', () => {
      const tentative_gScore = gScore.get(Utils.getNodeKey(startNode))! + stubNode.weight;

      expect(AStar.isNeighborHasCloserPath({
        tentative_gScore,
        gScore,
        neighbor: stubNode,
      })).toBeTrue();
    });

    it('should return false for Node with longer path', () => {
      stubNode = stubNode.clone({weight: NodeWeights.WALL});
      const tentative_gScore = gScore.get(Utils.getNodeKey(startNode))! + stubNode.weight;

      expect(AStar.isNeighborHasCloserPath({
        tentative_gScore,
        gScore,
        neighbor: stubNode,
      })).toBeFalse();
    });
  });

  describe('traverse', () => {
    beforeEach(() => {
      jasmine.addMatchers(SomeCustomMatchers);
    });
    // find path for the endNode
    // Grid * Node * Node --> [GridRow, GridRow]
    // Grid --> size 0, size N
    // Node --> out of bounds, in bounds
    // Node --> out of bounds, in bounds
    // find a shortest path, not find a shortest path
    it('should return closest path', () => {
      const grid: Grid = new Array(6)
          .fill(null)
          .map(() => new Array(6).fill(null));

      const startNode = {colIdx: 2, rowIdx: 5};
      const endNode = {colIdx: 5, rowIdx: 0};

      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          grid[row][col] = new Node({
            rowIdx: row,
            colIdx: col,
            isStartNode: startNode.colIdx === col && startNode.rowIdx === row,
            isFinishNode: endNode.colIdx === col && endNode.rowIdx === row,
          });
        }
      }

      const [nodesToAnimate, shortestPath] = new AStar({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx],
      }).traverse();

      let nodesToAnimateStub = [
        grid[5][2],
        grid[4][2],
        grid[3][2],
        grid[2][2],
        grid[1][2],
        grid[0][2],
        grid[0][3],
        grid[0][4],
        grid[0][5],
      ];

      nodesToAnimateStub = nodesToAnimateStub.map((node) => {
        const nodeCopy = node.clone({});
        nodeCopy.setAsVisited();
        return nodeCopy;
      });

      let shortestPathStub = [
        grid[4][2],
        grid[3][2],
        grid[2][2],
        grid[1][2],
        grid[0][2],
        grid[0][3],
        grid[0][4],
        grid[0][5],
      ];

      shortestPathStub = shortestPathStub.map((node) => node.clone({isShortestPath: true}));

      expect(nodesToAnimate).toReallyEqualVisitedNode(nodesToAnimateStub);
      expect(shortestPath).toReallyEqualAnimationNode(shortestPathStub);
    });

    it('should return empty closest path', () => {
      const grid: Grid = new Array(6)
          .fill(null)
          .map(() => new Array(6).fill(null));

      const startNode = {colIdx: 2, rowIdx: 5};
      const endNode = {colIdx: 5, rowIdx: 0};
      const walls = [
        {colIdx: 0, rowIdx: 2},
        {colIdx: 1, rowIdx: 2},
        {colIdx: 2, rowIdx: 2},
        {colIdx: 3, rowIdx: 2},
        {colIdx: 4, rowIdx: 2},
        {colIdx: 5, rowIdx: 2},
        {colIdx: 5, rowIdx: 3},
        {colIdx: 5, rowIdx: 4},
        {colIdx: 5, rowIdx: 5},
      ];

      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          grid[row][col] = new Node({
            rowIdx: row,
            colIdx: col,
            isStartNode: startNode.colIdx === col && startNode.rowIdx === row,
            isFinishNode: endNode.colIdx === col && endNode.rowIdx === row,
          });
        }
      }

      for (const keyEntry of walls) {
        grid[keyEntry.rowIdx][keyEntry.colIdx].setAsWall();
      }

      const [nodesToAnimate, shortestPath] = new AStar({
        grid,
        startNode: grid[startNode.rowIdx][startNode.colIdx],
        endNode: grid[endNode.rowIdx][endNode.colIdx],
      }).traverse();

      let nodesToAnimateStub = [
        grid[5][2],
        grid[4][2],
        grid[3][2],
        grid[3][3],
        grid[3][4],
        grid[4][3],
        grid[5][3],
        grid[5][4],
        grid[4][4],
        grid[3][1],
        grid[4][1],
        grid[5][1],
        grid[3][0],
        grid[4][0],
        grid[5][0],
      ];

      nodesToAnimateStub = nodesToAnimateStub.map((node) => {
        const nodeCopy = node.clone({});
        nodeCopy.setAsVisited();
        return nodeCopy;
      });

      expect(nodesToAnimate).toReallyEqualVisitedNode(nodesToAnimateStub);
      expect(shortestPath).toReallyEqualVisitedNode([]);
    });
  });
});
