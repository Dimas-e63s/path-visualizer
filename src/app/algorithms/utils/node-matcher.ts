import {Node} from '../../models/Node.class';
import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;
import CustomEqualityTester = jasmine.CustomEqualityTester;

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
}

export const SomeCustomMatchers: CustomMatcherFactories = {
  // @ts-ignore
  toReallyEqualVisitedNode: (util: MatchersUtil, customEqualityTester: CustomEqualityTester[]): CustomMatcher => {
    return {
      compare: function(expected: Node[], actual: Node[], anotherCustomArg: any): CustomMatcherResult {
        let passes = true;
        let message = '';
        if (actual.length === expected.length) {
          for (let i = 0; i < actual.length; i++) {
            if (!NodeValidation.isVisitedNodeCopy(actual[i], expected[i])) {
              passes = false;
              break;
            }
          }
        } else {
          message = `Expected ${expected.length} to have size ${actual.length}.`;
          passes = false;
        }

        return {
          pass: passes,
          message
        };
      },
    };
  },
};
