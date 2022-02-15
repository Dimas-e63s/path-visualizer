import {v4} from 'uuid';

export interface NodeInterface {
  rowIdx: number;
  colIdx: number;
  isStartNode?: boolean;
  isFinishNode?: boolean;
  distance?: number;
  weight?: NodeWeights;
  previousNode?: Node | null;
  isShortestPath?: boolean;
  isVisitedNode?: boolean;
}

export enum NodeWeights {
  WALL = Infinity,
  EMPTY = 1
}

export class Node {
  private readonly rowIdx: number;
  private readonly columnIdx: number;
  private readonly isStartNode: boolean;
  private readonly isFinishNode: boolean;
  private isVisited: boolean;
  isShortestPath;
  previousNode: any;
  distance: number;
  weight: number;
  readonly id: string;

  constructor({
                rowIdx,
                colIdx,
                isStartNode = false,
                isFinishNode = false,
                distance = Infinity,
                weight = NodeWeights.EMPTY,
                previousNode = null,
                isShortestPath = false,
              }: NodeInterface) {
    this.validateCoordinates(colIdx, rowIdx);
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

  private validateCoordinates(colIdx: number, rowIdx: number): void {
    if (Number.isNaN(colIdx) || Number.isNaN(rowIdx)) {
      throw new Error(`Coordinates can't be NaN provided colIdx: ${colIdx}, rowIdx: ${rowIdx}`);
    }

    if (colIdx < 0 || rowIdx < 0) {
      throw new Error(`Coordinates can't be negative numbers provided colIdx: ${colIdx}, rowIdx: ${rowIdx}`);
    }

    if (!(Number.isFinite(colIdx) && Number.isFinite(rowIdx))) {
      throw new Error(`Coordinates can't be equal to Infinity. Provided colIdx: ${colIdx}, rowIdx: ${rowIdx}`);
    }
  }

  private validateDestinationInput({isStartNode, isFinishNode}: {isStartNode: boolean, isFinishNode: boolean}) {
    if (isStartNode && isFinishNode) {
      throw new Error(`Node can't be startNode and endNode at the same time`);
    }
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
      ...args,
    });
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
    if (this.isEmptyNode()) {
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

  private isEmptyNode(): boolean {
    return !this.getIsStartNode() && !this.getIsFinishNode();
  }
}
