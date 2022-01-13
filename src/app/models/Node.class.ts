interface NodeInterface {
  rowIdx: number;
  colIdx: number;
  isStartNode: boolean;
  isFinishNode: boolean
}
export class Node {
  private readonly rowIdx: number;
  private readonly columnIdx: number;
  private isStartNode: boolean;
  private isFinishNode: boolean;

  constructor({rowIdx, colIdx, isStartNode, isFinishNode}: NodeInterface) {
    this.rowIdx = rowIdx;
    this.columnIdx = colIdx;
    this.isStartNode = isStartNode;
    this.isFinishNode = isFinishNode;
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
    // return this.isVisited;
  }

  isUnvisitedNode() {
    // return !this.isVisited;
  }

  getWeightOfNode() {
    // return this.weight;
  }

  getIsStartNode(): boolean {
    return this.isStartNode;
  }

  getIsFinishNode(): boolean {
    return this.isFinishNode;
  }

}
