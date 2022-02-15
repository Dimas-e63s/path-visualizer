import {Node, NodeInterface} from './models/Node.class';
import {Grid} from './models/grid.types';

export class GridBuilder {
  static calculateAmountOfRows(height: number) {
    return Math.floor((height * .7) / 30);
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

  static generateGrid({row, col}: {row: number, col: number}): Grid {
    const nodes = GridBuilder.generateEmptyGrid({row, col});

    for (let rowIdx = 0; rowIdx < row; rowIdx++) {
      for (let colIdx = 0; colIdx < col; colIdx++) {
        nodes[rowIdx][colIdx] = GridBuilder.generateGridNode({rowIdx, colIdx});
      }
    }

    return nodes;
  }
}
