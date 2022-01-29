import {Node} from '../../../models/Node.class';
import {GridRow} from '../../../models/grid.types';

export class NodeValidation {
  static isHasSameId(a: Node, b: Node) {
    return a.id === b.id;
  }

  static rowEquals(a: Node, b: Node) {
    return a.getRowIdx() === b.getRowIdx();
  }

  static colEquals(a: Node, b: Node) {
    return a.getColumnIdx() === b.getColumnIdx();
  }

  static weightEquals(a: Node, b: Node) {
    return a.weight === b.weight;
  }

  static visitedNodesEqual(a: Node, b: Node) {
    return a.isVisitedNode() && b.isVisitedNode();
  }

  static isVisitedNodeCopy(a: Node, b: Node) {
    return NodeValidation.rowEquals(a, b)
      && NodeValidation.colEquals(a, b)
      && NodeValidation.weightEquals(a, b)
      && NodeValidation.visitedNodesEqual(a, b)
      && !NodeValidation.isHasSameId(a, b)
  }

  static isEqualSize(a: GridRow, b: GridRow): boolean {
    return a.length === b.length;
  }
}
