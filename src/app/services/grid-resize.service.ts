import { Injectable } from '@angular/core';
import {GridSize} from '../models/grid.types';
import {distinctUntilChanged, fromEvent, map, Observable, Subject, takeUntil, tap} from 'rxjs';
import {GridBuilder} from '../grid-builder';
import {Utils} from '../algorithms/utils/utils.class';
import {GridService} from './grid.service';

@Injectable({
  providedIn: 'root'
})
export class GridResizeService {
  private destroy$ = new Subject<void>();

  constructor(private gridService: GridService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isGridSizeFixed(a: GridSize, b: GridSize): boolean {
    return a.totalCol === b.totalCol && a.totalRow === b.totalRow;
  }

  getResizeObservable(): Observable<GridSize> {
    return fromEvent(window, 'resize')
      .pipe(
        map(({target}) => target as Window),
        map(({innerHeight, innerWidth}) => ({
          totalCol: GridBuilder.calculateAmountOfColumns(innerWidth),
          totalRow: GridBuilder.calculateAmountOfRows(innerHeight),
        })),
        distinctUntilChanged(this.isGridSizeFixed),
        takeUntil(this.destroy$),
        tap(({totalCol, totalRow}) => {
          this.updateGridAfterResize({totalCol, totalRow});
        })
      )
  }

  updateGridAfterResize({totalCol, totalRow}: GridSize) {
    this.updateGridSize({totalCol, totalRow});
    this.updateDestinationNodesAfterResize({newRowIdx: totalRow - 1, newColIdx: totalCol - 1});
  }

  updateGridSize({totalCol, totalRow}: GridSize) {
    const {
      totalCol: currentAmountOfCols,
      totalRow: currentAmountOfRows,
    } = Utils.getGridSize(this.gridService.nodes);

    if (currentAmountOfRows > totalRow) {
      this.decreaseGridHeight(totalRow);
    } else if (currentAmountOfRows < totalRow) {
      this.gridService.nodes.push(
        ...this.increaseGridHeight({totalRow, currentAmountOfCols, currentAmountOfRows}),
      );
    }

    if (currentAmountOfCols < totalCol) {
      this.increaseGridLength({totalCol, currentAmountOfCols});
    } else if (currentAmountOfCols > totalCol) {
      this.decreaseGridLength(totalCol);
    }
  }

  decreaseGridHeight(newRowCount: number): void {
    this.gridService.nodes.length = newRowCount;
  }

  decreaseGridLength(newColCount: number): void {
    this.gridService.nodes.forEach(row => {
      row.length = newColCount;
    });
  }

  increaseGridHeight({
                       totalRow,
                       currentAmountOfRows,
                       currentAmountOfCols,
                     }: {totalRow: number, currentAmountOfRows: number, currentAmountOfCols: number}) {
    const newGrid = GridBuilder.generateEmptyGrid({row: totalRow - currentAmountOfRows, col: currentAmountOfCols});

    for (let rowIdx = 0; rowIdx < newGrid.length; rowIdx++) {
      for (let colIdx = 0; colIdx < newGrid[0].length; colIdx++) {
        newGrid[rowIdx][colIdx] = GridBuilder.generateGridNode({rowIdx: currentAmountOfRows + rowIdx, colIdx});
      }
    }

    return newGrid;
  }

  increaseGridLength({totalCol, currentAmountOfCols}: {totalCol: number, currentAmountOfCols: number}) {
    for (let i = 0; i < totalCol - currentAmountOfCols; i++) {
      this.gridService.nodes.forEach((row, idx) => {
        row.push(
          GridBuilder.generateGridNode({
            rowIdx: idx,
            colIdx: currentAmountOfCols + i,
          }),
        );
      });
    }
  }

  updateDestinationNodesAfterResize({newRowIdx, newColIdx}: {newRowIdx: number, newColIdx: number}) {
    const newStartNode = GridBuilder.generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.gridService.startNode.rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.gridService.startNode.colIdx, newIdx: newColIdx}),
      isStartNode: true,
    });

    const newEndNode = GridBuilder.generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.gridService.finishNode.rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.gridService.finishNode.colIdx, newIdx: newColIdx}),
      isFinishNode: true,
    });

    this.gridService.finishNode = Utils.getNodeCoordinates(newEndNode);
    this.gridService.startNode = Utils.getNodeCoordinates(newStartNode);

    this.gridService.setDestinationNode(this.gridService.finishNode);
    this.gridService.setDestinationNode(this.gridService.startNode);
  }

  isIdxOutOfGrid({oldIdx, newIdx}: {oldIdx: number, newIdx: number}): boolean {
    return oldIdx > newIdx;
  }

  getNodeIdxAfterResize({oldIdx, newIdx}: {oldIdx: number, newIdx: number}): number {
    return this.isIdxOutOfGrid({oldIdx, newIdx}) ? newIdx : oldIdx;
  }
}
