import { Injectable } from '@angular/core';
import {Grid} from '../models/grid.types';

export interface NodeCoordinates {
  rowIdx: number;
  colIdx: number;
}

// TODO:
// - limit injector scope only to app component

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private startNode = {colIdx: 2, rowIdx: 25};
  private endNode = {colIdx: 25, rowIdx: 0};
  private grid: Grid = [];

  constructor() { }

  // SELECTORS

  getStartNode(): NodeCoordinates {
    return this.startNode;
  }

  getEndNode(): NodeCoordinates {
    return this.endNode;
  }

  getGrid(): Grid {
    return this.grid;
  }

  // ACTIONS
  updateStartNode(coordinates: NodeCoordinates): void {
    this.startNode = coordinates;
  }

  updateEndNode(coordinates: NodeCoordinates): void {
    this.endNode = coordinates;
  }

  updateGrid(newGrid: Grid) {
    this.grid = newGrid;
  }
}
