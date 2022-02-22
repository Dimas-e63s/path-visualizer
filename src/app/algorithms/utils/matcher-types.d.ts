declare namespace jasmine {
  interface Matchers<T> {
    toReallyEqualVisitedNode(expected: any, anotherCustomArg?: any, expectationFailOutput?: any): boolean;
    toReallyEqualAnimationNode(expected: any, anotherCustomArg?: any, expectationFailOutput?: any): boolean;
  }
}
