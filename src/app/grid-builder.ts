import {Node, NodeInterface} from './models/Node.class';
import {Grid, GridSize} from './models/grid.types';

export class GridBuilder {
  static calculateAmountOfRows(height: number) {
    return Math.floor((height * .7) / 30);
  }

  static calculateAmountOfColumns(width: number) {
    return Math.floor(width / 30);
  }

  static generateEmptyGrid({totalRow, totalCol}: GridSize) {
    // TODO: - add validation for passed params
    return Array(totalRow)
        .fill(0)
        .map(() => Array(totalCol).fill(null));
  }

  static generateGridNode(metaData: NodeInterface) {
    // TODO: - should become one version
    return new Node(metaData);
  }

  static generateGrid({totalRow, totalCol}: GridSize): Grid {
    const nodes = GridBuilder.generateEmptyGrid({totalRow, totalCol});

    for (let rowIdx = 0; rowIdx < totalRow; rowIdx++) {
      for (let colIdx = 0; colIdx < totalCol; colIdx++) {
        nodes[rowIdx][colIdx] = GridBuilder.generateGridNode({rowIdx, colIdx});
      }
    }

    return nodes;
  }
}
