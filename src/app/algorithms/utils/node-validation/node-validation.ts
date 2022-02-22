import {Node} from '../../../models/Node.class';
import {GridRow} from '../../../models/grid.types';

// TODO: - add return type
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

  static isEqualSize(a: GridRow, b: GridRow): boolean {
    return a.length === b.length;
  }

  static isStartNodeEquals(a: Node, b: Node): boolean {
    return a.getIsStartNode() === b.getIsStartNode();
  }

  static isEndNodeEquals(a: Node, b: Node): boolean {
    return a.getIsFinishNode() === b.getIsFinishNode();
  }

  static isDistanceEquals(a: Node, b: Node): boolean {
    return a.distance === b.distance;
  }

  static isShortestNodesEquals(a: Node, b: Node): boolean {
    return a.isShortestPath === b.isShortestPath;
  }

  static isVisitedNodeCopy(a: Node, b: Node) {
    return NodeValidation.rowEquals(a, b) &&
      NodeValidation.colEquals(a, b) &&
      NodeValidation.weightEquals(a, b) &&
      NodeValidation.visitedNodesEqual(a, b) &&
      NodeValidation.isShortestNodesEquals(a, b) &&
      !NodeValidation.isHasSameId(a, b);
  }

  static isNodeCopy(a: Node, b: Node): boolean {
    return NodeValidation.rowEquals(a, b) &&
      NodeValidation.colEquals(a, b) &&
      NodeValidation.weightEquals(a, b) &&
      NodeValidation.isStartNodeEquals(a, b) &&
      NodeValidation.isEndNodeEquals(a, b) &&
      NodeValidation.isShortestNodesEquals(a, b) &&
      !NodeValidation.isHasSameId(a, b);
  }
}
