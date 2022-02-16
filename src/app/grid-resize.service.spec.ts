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

  fdescribe('isGridSizeFixed', () => {
    it('should return true if size the same', () => {
      expect(service.isGridSizeFixed(
        {totalCol: 10, totalRow: 10},
        {totalCol: 10, totalRow: 10},
      )).toBeTrue();
    });

    it('should return false if size changed', () => {
      expect(service.isGridSizeFixed(
        {totalCol: 10, totalRow: 10},
        {totalCol: 10, totalRow: 11},
      )).toBeFalse();
    });
  });
});
