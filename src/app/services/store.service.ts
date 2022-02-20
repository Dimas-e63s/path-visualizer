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
  private startNode!: NodeCoordinates;
  private endNode!: NodeCoordinates;
  private grid: Grid = [];
  // TODO: - add type def
  private prevNode = {rowIdx: null, colIdx: null};

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

  getPrevNode(): any {
    return this.prevNode;
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

  // TODO: - add type def
  updatePrevNode(node: any): void {
    this.prevNode = node;
  }
}
