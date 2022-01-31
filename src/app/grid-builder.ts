import {Node, NodeInterface} from './models/Node.class';

export class GridBuilder {
  static calculateAmountOfRows(height: number) {
    return Math.floor((height * .8) / 30);
  }

  static calculateAmountOfColumns(width: number) {
    return Math.floor(width / 30);
  }

  static generateEmptyGrid({row, col}: {row: number, col: number}) {
    // TODO: - add validation for passed params
    return Array(row)
      .fill(0)
      .map(() => Array(col).fill(null));
  }

  static generateGridNode(metaData: NodeInterface) {
    // TODO: - should become one version
    return new Node(metaData);
  }
}
