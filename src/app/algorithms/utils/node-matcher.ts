import {Node} from '../../models/Node.class';
import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;
import CustomEqualityTester = jasmine.CustomEqualityTester;
import {NodeValidation} from './node-validation/node-validation';
import {GridRow} from '../../models/grid.types';

export const SomeCustomMatchers: CustomMatcherFactories = {
  // @ts-ignore
  toReallyEqualVisitedNode: (util: MatchersUtil, customEqualityTester: CustomEqualityTester[]): CustomMatcher => {
    return {
      compare: function(expected: GridRow, actual: GridRow, anotherCustomArg: any): CustomMatcherResult {
        let passes = true;
        let message = '';
        if (NodeValidation.isEqualSize(actual, expected)) {
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
