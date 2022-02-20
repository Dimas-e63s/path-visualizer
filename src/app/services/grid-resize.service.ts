import { Injectable } from '@angular/core';
import {GridSize} from '../models/grid.types';
import {distinctUntilChanged, fromEvent, map, Observable, Subject, takeUntil, tap} from 'rxjs';
import {GridBuilder} from '../grid-builder';
import {Utils} from '../algorithms/utils/utils.class';
import {GridService} from './grid.service';
import {StoreService} from './store.service';

// TODO:
// - refactor to use Resize Observer API

@Injectable({
  providedIn: 'root'
})
export class GridResizeService {
  private destroy$ = new Subject<void>();

  constructor(
    private gridService: GridService,
    private storeService: StoreService
  ) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private isGridSizeFixed(a: GridSize, b: GridSize): boolean {
    return a.totalCol === b.totalCol && a.totalRow === b.totalRow;
  }

  private updateGridAfterResize({totalCol, totalRow}: GridSize) {
    this.updateGridSize({totalCol, totalRow});
    this.updateDestinationNodesAfterResize({newRowIdx: totalRow - 1, newColIdx: totalCol - 1});
  }

  private updateGridSize({totalCol, totalRow}: GridSize) {
    const {
      totalCol: currentAmountOfCols,
      totalRow: currentAmountOfRows,
    } = Utils.getGridSize(this.storeService.getGrid());

    if (currentAmountOfRows > totalRow) {
      this.decreaseGridHeight(totalRow);
    } else if (currentAmountOfRows < totalRow) {
      this.storeService.getGrid().push(
        ...this.increaseGridHeight({totalRow, currentAmountOfCols, currentAmountOfRows}),
      );
    }

    if (currentAmountOfCols < totalCol) {
      this.increaseGridLength({totalCol, currentAmountOfCols});
    } else if (currentAmountOfCols > totalCol) {
      this.decreaseGridLength(totalCol);
    }
  }

  private decreaseGridHeight(newRowCount: number): void {
    this.storeService.getGrid().length = newRowCount;
  }

  private decreaseGridLength(newColCount: number): void {
    this.storeService.getGrid().forEach(row => {
      row.length = newColCount;
    });
  }

  private increaseGridHeight({
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

  private increaseGridLength({totalCol, currentAmountOfCols}: {totalCol: number, currentAmountOfCols: number}) {
    for (let i = 0; i < totalCol - currentAmountOfCols; i++) {
      this.storeService.getGrid().forEach((row, idx) => {
        row.push(
          GridBuilder.generateGridNode({
            rowIdx: idx,
            colIdx: currentAmountOfCols + i,
          }),
        );
      });
    }
  }

  private updateDestinationNodesAfterResize({newRowIdx, newColIdx}: {newRowIdx: number, newColIdx: number}) {
    const newStartNode = GridBuilder.generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.storeService.getStartNode().rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.storeService.getStartNode().colIdx, newIdx: newColIdx}),
      isStartNode: true,
    });

    const newEndNode = GridBuilder.generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.storeService.getEndNode().rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.storeService.getEndNode().colIdx, newIdx: newColIdx}),
      isFinishNode: true,
    });

    this.storeService.updateEndNode(Utils.getNodeCoordinates(newEndNode));
    this.storeService.updateStartNode(Utils.getNodeCoordinates(newStartNode));

    this.gridService.setDestinationNode(this.storeService.getEndNode());
    this.gridService.setDestinationNode(this.storeService.getStartNode());
  }

  private isIdxOutOfGrid({oldIdx, newIdx}: {oldIdx: number, newIdx: number}): boolean {
    return oldIdx > newIdx;
  }

  private getNodeIdxAfterResize({oldIdx, newIdx}: {oldIdx: number, newIdx: number}): number {
    return this.isIdxOutOfGrid({oldIdx, newIdx}) ? newIdx : oldIdx;
  }
}
