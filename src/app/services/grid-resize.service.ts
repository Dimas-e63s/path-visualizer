import { Injectable } from '@angular/core';
import {GridSize} from '../models/grid.types';

@Injectable({
  providedIn: 'root'
})
export class GridResizeService {

  constructor() { }

  isGridSizeFixed(a: GridSize, b: GridSize): boolean {
    return a.totalCol === b.totalCol && a.totalRow === b.totalRow;
  }
}
