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
    return a.getColumnIdx() !== b.getColumnIdx();
  }
}

export const SomeCustomMatchers: CustomMatcherFactories = {
  // @ts-ignore
  toReallyEqualVisitedNode: function(util: MatchersUtil, customEqualityTester: CustomEqualityTester[]): CustomMatcher {
    return {
      compare: function(expected: Node[], actual: Node[], anotherCustomArg: any): CustomMatcherResult {
        let passes = true;
        let message = '';
        if (actual.length === expected.length) {
          for (let i = 0; i < actual.length; i++) {
            if (
              actual[i].getRowIdx() !== expected[i].getRowIdx()
              || actual[i].getColumnIdx() !== expected[i].getColumnIdx()
              || actual[i].isVisitedNode() === expected[i].isVisitedNode()
              || actual[i].weight !== expected[i].weight
              || NodeValidation.isHasSameId(actual[i], expected[i])
            ) {
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
  // @ts-ignore
  toReallyEqualShortestPathNode: function(util: MatchersUtil, customEqualityTester: CustomEqualityTester[]): CustomMatcher {
    return {
      compare: function(expected: Node[], actual: Node[], anotherCustomArg: any): CustomMatcherResult {
        let passes = true;
        let message = '';
        if (actual.length === expected.length) {
          for (let i = 0; i < actual.length; i++) {
            if (
              actual[i].getRowIdx() !== expected[i].getRowIdx()
              || actual[i].getColumnIdx() !== expected[i].getColumnIdx()
              || actual[i].weight !== expected[i].weight
              || NodeValidation.isHasSameId(actual[i], expected[i])
              || actual[i].isShortestPath !== expected[i].isShortestPath
            ) {
              debugger
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
  }
};
