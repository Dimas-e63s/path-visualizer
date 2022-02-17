import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from '../header/header.component';
import {Grid, GridMap} from '../models/grid.types';
import {GridBuilder} from '../grid-builder';
import {BacktrackingIterative} from '../algorithms/maze-generation/backtracking/backtracking-iterative.class';
import {BacktrackingRecursive} from '../algorithms/maze-generation/backtracking/backtracking-recursive.class';
import {Kruskal} from '../algorithms/maze-generation/kruskal/kruskal';
import {Prim} from '../algorithms/maze-generation/prim/prim';
import {Node} from '../models/Node.class';

@Injectable({
  providedIn: 'root'
})
export class GridService {
   startNode = {colIdx: 2, rowIdx: 25};
   finishNode = {colIdx: 25, rowIdx: 0};
  private destroy$ = new Subject<void>();
  selectedPathAlgo: PathAlgorithmEnum | null = null;
  nodes: Grid = [];
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;

  constructor() { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initGrid() {
    this.nodes = GridBuilder.generateGrid(this.getGridSize());
    this.startNode = this.generateStartNode(this.getGridSize());
    this.finishNode = this.generateEndNode(this.getGridSize());
    this.setDestinationNode(this.startNode);
    this.setDestinationNode(this.finishNode);
  }

  private getGridSize(): {row: number, col: number} {
    return {
      row: GridBuilder.calculateAmountOfRows(window.innerHeight),
      col: GridBuilder.calculateAmountOfColumns(window.innerWidth),
    };
  }

  generateStartNode(gridSize: {row: number, col: number}): {rowIdx: number, colIdx: number} {
    return {
      colIdx: 0,
      rowIdx: Math.floor(gridSize.row / 2),
    };
  }

  generateEndNode(gridSize: {row: number, col: number}): {rowIdx: number, colIdx: number} {
    return {
      colIdx: gridSize.col - 1,
      rowIdx: Math.floor(gridSize.row / 2),
    };
  }

  setDestinationNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    this.nodes[rowIdx][colIdx] = GridBuilder.generateGridNode({
      rowIdx: rowIdx,
      colIdx: colIdx,
      isStartNode: this.isStartNode({rowIdx, colIdx}),
      isFinishNode: this.isEndNode({rowIdx, colIdx}),
    });
  }

  isStartNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    return rowIdx === this.startNode.rowIdx && this.startNode.colIdx === colIdx;
  }

  isEndNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    return rowIdx === this.finishNode.rowIdx && this.finishNode.colIdx === colIdx;
  }

  getMaze(mazeAlgo: MazeGenerationEnum): GridMap {
    switch (mazeAlgo) {
      case MazeGenerationEnum.BACKTRACKING_ITR:
        return new BacktrackingIterative(this.nodes, this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.BACKTRACKING_REC:
        return new BacktrackingRecursive(this.nodes, this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.KRUSKAL:
        return new Kruskal(this.nodes, this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.PRIM:
        return new Prim(this.nodes, this.getStartNode(), this.getEndNode()).getMaze();
    }
  }

  private getStartNode(): Node {
    return this.nodes[this.startNode.rowIdx][this.startNode.colIdx];
  }

  private getEndNode(): Node {
    return this.nodes[this.finishNode.rowIdx][this.finishNode.colIdx];
  }
}
