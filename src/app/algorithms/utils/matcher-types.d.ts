declare namespace jasmine {
  interface Matchers<T> {
    toReallyEqualVisitedNode(expected: any, anotherCustomArg?: any, expectationFailOutput?: any): boolean;
    toReallyEqualShortestPathNode(expected: any, anotherCustomArg?: any, expectationFailOutput?: any): boolean;
  }
}
