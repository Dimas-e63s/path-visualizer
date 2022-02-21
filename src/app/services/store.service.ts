import { Injectable } from '@angular/core';
import {Grid} from '../models/grid.types';
import {GridBuilder} from '../grid-builder';

// TODO: -extract interface
export interface NodeCoordinates {
  rowIdx: number;
  colIdx: number;
}

// TODO:
// - limit injector scope only to app component
// - consider move state to Observable streams

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private startNode!: NodeCoordinates;
  private endNode!: NodeCoordinates;
  private grid: Grid = [];
  // TODO:
  //  - add type def
  //  - rename state
  private prevNode = {row: null, col: null};
  private prevHead = {col: null, row: null};
  private prevEnd = {col: null, row: null};

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

  getPrevStartNode(): any {
    return this.prevHead;
  }

  getPrevEndNode(): any {
    return this.prevEnd;
  }

  isStartNode({rowIdx, colIdx}: NodeCoordinates) {
    return rowIdx === this.getStartNode().rowIdx && this.getStartNode().colIdx === colIdx;
  }

  isEndNode({rowIdx, colIdx}: NodeCoordinates) {
    return rowIdx === this.getEndNode().rowIdx && this.getEndNode().colIdx === colIdx;
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

  // TODO: - add type def
  updatePrevHead(node: any): void {
    this.prevHead = node;
  }

  // TODO: - add type def
  updatePrevEnd(node: any): void {
    this.prevEnd = node;
  }

  setDestinationNode({rowIdx, colIdx}: NodeCoordinates) {
    this.getGrid()[rowIdx][colIdx] = GridBuilder.generateGridNode({
      rowIdx: rowIdx,
      colIdx: colIdx,
      isStartNode: this.isStartNode({rowIdx, colIdx}),
      isFinishNode: this.isEndNode({rowIdx, colIdx}),
    });
  }
}
