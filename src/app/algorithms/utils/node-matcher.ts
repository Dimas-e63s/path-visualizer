import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;
import CustomEqualityTester = jasmine.CustomEqualityTester;
import {NodeValidation} from './node-validation/node-validation';
import {GridRow} from '../../models/grid.types';
import {Node} from '../../models/Node.class';

type comparatorFn = (a: Node, b: Node) => boolean;

class NodeMatcherUtil {
  constructor(private readonly comparator: comparatorFn) {
  }

  nodeMatcher(): CustomMatcher {
    return {
      compare: (expected: GridRow, actual: GridRow, anotherCustomArg: any): CustomMatcherResult => {
        let passes = true;
        let message = '';

        if (NodeValidation.isEqualSize(actual, expected)) {
          for (let i = 0; i < actual.length; i++) {
            if (!this.comparator(actual[i], expected[i])) {
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
          message,
        };
      },
    };
  }
}

export const SomeCustomMatchers: CustomMatcherFactories = {
  toReallyEqualVisitedNode:
    (util: MatchersUtil, customEqualityTester: Readonly<CustomEqualityTester[]>): CustomMatcher =>
      new NodeMatcherUtil(NodeValidation.isVisitedNodeCopy).nodeMatcher(),
  toReallyEqualAnimationNode:
    (util: MatchersUtil, customEqualityTester: Readonly<CustomEqualityTester[]>): CustomMatcher =>
      new NodeMatcherUtil(NodeValidation.isNodeCopy).nodeMatcher(),
};
