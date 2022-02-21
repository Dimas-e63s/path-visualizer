import { TestBed } from '@angular/core/testing';

import { GridResizeService } from './grid-resize.service';

describe('GridResizeService', () => {
  let service: GridResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isGridSizeFixed', () => {
    it('should return true if size the same', () => {
      // @ts-expect-error
      expect(service.isGridSizeFixed(
        {totalCol: 10, totalRow: 10},
        {totalCol: 10, totalRow: 10},
      )).toBeTrue();
    });

    it('should return false if size changed', () => {
      // @ts-expect-error
      expect(service.isGridSizeFixed(
        {totalCol: 10, totalRow: 10},
        {totalCol: 10, totalRow: 11},
      )).toBeFalse();
    });
  });

  describe('isIdxOutOfGrid', () => {
    it('should return true if Node oldIdx grater than newIdx', () => {
      // @ts-expect-error
      expect(service.isIdxOutOfGrid({oldIdx: 10, newIdx: 9})).toBeTrue();
    });

    it('should return false if Node oldIdx grater than newIdx', () => {
      // @ts-expect-error
      expect(service.isIdxOutOfGrid({oldIdx: 10, newIdx: 11})).toBeFalse();
    });

    it('should return false if Node oldIdx equal to newIdx', () => {
      // @ts-expect-error
      expect(service.isIdxOutOfGrid({oldIdx: 10, newIdx: 10})).toBeFalse();
    });
  });


  describe('getNodeIdxAfterResize', () => {
    it('should return newIdx for idx out of grid bounds', () => {
      // @ts-expect-error
      expect(service.getNodeIdxAfterResize({oldIdx: 10, newIdx: 9})).toEqual(9);
    });

    it('should return oldIdx for idx in grid bounds', () => {
      // @ts-expect-error
      expect(service.getNodeIdxAfterResize({oldIdx: 10, newIdx: 11})).toEqual(10);
    });
  });
});
