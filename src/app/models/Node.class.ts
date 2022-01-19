import {v4} from 'uuid';
export interface NodeInterface {
  rowIdx: number;
  colIdx: number;
  isStartNode?: boolean;
  isFinishNode?: boolean;
  distance?: number;
  weight?: number
  previousNode?: Node | null
  isShortestPath?: boolean
}

export enum NodeWeights {
  WALL = Infinity,
  EMPTY = 1
}

export class Node {
  private readonly rowIdx: number;
  private readonly columnIdx: number;
  private isStartNode: boolean;
  private isFinishNode: boolean;
  private isVisited: boolean;
  isShortestPath;
  previousNode: any;
  distance: number;
  weight: number;
  readonly id: string;

  // @ts-ignore
  constructor({rowIdx, colIdx, isStartNode = false, isFinishNode = false, distance = Infinity, weight = NodeWeights.EMPTY, previousNode = null, isShortestPath = false}: NodeInterface) {
    this.id = v4();
    this.rowIdx = rowIdx;
    this.columnIdx = colIdx;
    this.isStartNode = isStartNode;
    this.isFinishNode = isFinishNode;
    this.isVisited = false;
    this.isShortestPath = isShortestPath;
    this.distance = distance;
    this.weight = weight;
    this.previousNode = previousNode;
  }

  clone(args: Partial<NodeInterface> = {}): Node {
    return new Node({
      rowIdx: this.rowIdx,
      colIdx: this.columnIdx,
      isStartNode: this.isStartNode,
      isFinishNode: this.isFinishNode,
      distance: this.distance,
      weight: this.weight,
      previousNode: this.previousNode,
      isShortestPath: this.isShortestPath,
      ...args
    });
  }

  setFinishNode(): void {
    this.isFinishNode = true;
  }

  setStartNode(): void {
    this.isStartNode = true;
  }

  getColumnIdx(): number {
    return this.columnIdx;
  }

  getRowIdx(): number {
    return this.rowIdx;
  }

  isVisitedNode() {
    return this.isVisited;
  }

  isWall(): boolean {
    return this.weight === NodeWeights.WALL;
  }

  setAsVisited(): void {
    this.isVisited = true;
  }

  setAsWall(): void {
    if (!this.isStartNode && !this.isFinishNode) {
      this.weight = NodeWeights.WALL;
    }
  }

  getIsStartNode(): boolean {
    return this.isStartNode;
  }

  getIsFinishNode(): boolean {
    return this.isFinishNode;
  }

  getIsShortestPath() {
    return !this.isStartNode && !this.isFinishNode && this.isShortestPath;
  }
}
