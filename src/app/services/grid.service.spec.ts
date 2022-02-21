import { TestBed } from '@angular/core/testing';

import { GridService } from './grid.service';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateStartNode', () => {
    it('should return startNode based on size of the frid', () => {
      expect(
        // @ts-expect-error
        service.getDefaultStartNode({totalRow: 20, totalCol: 20}),
      ).toEqual({colIdx: 0, rowIdx: 10});
    });
  });

  describe('generateEndNode', () => {
    it('should return endNode based on size of the frid', () => {
      expect(
        // @ts-expect-error
        service.getDefaultEndNode({totalRow: 20, totalCol: 34}),
      ).toEqual({colIdx: 33, rowIdx: 10});
    });
  });
});
