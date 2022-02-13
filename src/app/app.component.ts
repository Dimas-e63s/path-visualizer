import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node, NodeWeights} from './models/Node.class';
import {Dijkstra} from './algorithms/dijkstra/dijkstra';
import {Grid, GridMap, GridRow, GridSize} from './models/grid.types';
import {
  concat,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  from,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from './header/header.component';
import {Kruskal} from './algorithms/maze-generation/kruskal/kruskal';
import {Prim} from './algorithms/maze-generation/prim/prim';
import {AStar} from './algorithms/a-star/a-star';
import {UnweightedAlgorithms} from './algorithms/unweighted/unweighted-algorithms';
import {Utils} from './algorithms/utils/utils.class';
import {GridBuilder} from './grid-builder';
import {BacktrackingIterative} from './algorithms/maze-generation/backtracking/backtracking-iterative.class';
import {BacktrackingRecursive} from './algorithms/maze-generation/backtracking/backtracking-recursive.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private startNode = {colIdx: 2, rowIdx: 25};
  private finishNode = {colIdx: 25, rowIdx: 0};
  private destroy$ = new Subject<void>();
  private selectedPathAlgo: PathAlgorithmEnum = PathAlgorithmEnum.BFS;
  nodes!: Grid;
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;
  isButtonsDisabled = false;

  ngOnInit(): void {
    this.initGrid();
    fromEvent(window, 'resize')
      .pipe(
        map(({target}) => target as Window),
        map(target => ({
          totalCol: GridBuilder.calculateAmountOfColumns(target.innerWidth),
          totalRow: GridBuilder.calculateAmountOfRows(target.innerHeight),
        })),
        distinctUntilChanged(this.isGridSizeFixed),
        takeUntil(this.destroy$),
      )
      .subscribe(({totalCol, totalRow}) => {
        this.updateGridAfterResize({totalCol, totalRow});
      });
  }

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

  getShortestPath(): [Node[], Node[]] {
    const algorithmData = {
      grid: this.nodes,
      startNode: this.getStartNode(),
      endNode: this.getEndNode(),
    };

    switch (this.selectedPathAlgo) {
      case PathAlgorithmEnum.DIJKSTRA:
        return new Dijkstra(algorithmData).traverse();
      case PathAlgorithmEnum.A_STAR:
        return new AStar(algorithmData).traverse();
      case PathAlgorithmEnum.BFS:
        return new UnweightedAlgorithms(algorithmData).bfs();
      case PathAlgorithmEnum.DFS:
        return new UnweightedAlgorithms(algorithmData).dfs();
    }
  }

  runAlgo() {
    this.disableButtons();
    this.animatePathfindingAlgo();
  }

  animatePathfindingAlgo() {
    const [visitedNodesInOrder, shortestPath] = this.getShortestPath();

    concat(
      this.getAnimationObservable(visitedNodesInOrder),
      this.getAnimationObservable(shortestPath)
    )
      .pipe(
        finalize(() => this.activateButtons()),
      )
      .subscribe();
  }

  getAnimationObservable(nodeArray: Node[]): Observable<Node> {
    return from(nodeArray)
      .pipe(
        concatMap((node) => of(node).pipe(delay(15))),
        tap((node) => {
          this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
        }),
      );
  }

  onAddedWall({col, row}: {col: number, row: number}) {
    if (this.isButtonsDisabled) {
      return;
    }

    const selectedNode = this.nodes[row][col];
    if (selectedNode.getIsStartNode()) {
      this.moveHead = true;
      // @ts-ignore
      this.prevHead = {col, row};
    } else if (selectedNode.getIsFinishNode()) {
      this.moveEnd = true;
      // @ts-ignore
      this.prevEnd = {col, row};
    } else {
      this.addWall(this.nodes[row][col]);
    }
  }

  startEditing(): void {
    if (!this.moveHead && !this.moveEnd && !this.isButtonsDisabled) {
      this.buildWalls = !this.buildWalls;
    }
  }

  breakEdit(): void {
    this.buildWalls = false;
    this.moveHead = false;
    this.moveEnd = false;
  }

  onDraw($event: any) {
    if (this.moveHead && (this.prevHead.row !== $event.row || this.prevHead.col !== $event.col)) {
      //@ts-ignore
      this.removeHeadNode(this.nodes[this.prevHead.row][this.prevHead.col]);
      this.addHeadNode($event);
    } else if (this.moveEnd && (this.prevEnd.row !== $event.row || this.prevEnd.col !== $event.col)) {
      //@ts-ignore
      this.removeEndNode(this.nodes[this.prevEnd.row][this.prevEnd.col]);
      this.addEndNode($event);
    } else if (this.isSameNode($event) && this.buildWalls) {
      this.prevNode = $event;
      this.addWall(this.nodes[$event.row][$event.col]);
    }
  }

  generateStartNode(gridSize: {row: number, col: number}): {rowIdx: number, colIdx: number} {
    return {
      colIdx: 0,
      rowIdx: gridSize.row / 2
    }
  }

  generateEndNode(gridSize: {row: number, col: number}): {rowIdx: number, colIdx: number} {
    return {
      colIdx: gridSize.col - 1,
      rowIdx: gridSize.row / 2
    }
  }

  clearBoard() {
    this.initGrid();
  }

  trackByRow(index: number, row: GridRow) {
    return row.length;
  }

  trackByNode(index: number, node: Node) {
    return node.id;
  }

  clearWalls() {
    this.disableButtons();
    for (const row of this.nodes) {
      for (const column of row) {
        this.removeWall(column);
      }
    }
    this.activateButtons();
  }

  addHeadNode($event: any) {
    this.startNode = {colIdx: $event.col, rowIdx: $event.row};
    this.prevHead = $event;
    this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeHeadNode(node: Node): void {
    if (node.getIsStartNode()) {
      this.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        isStartNode: false,
      });
    }
  }

  addEndNode($event: any) {
    this.prevEnd = $event;
    this.finishNode = {colIdx: $event.col, rowIdx: $event.row};
    this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeEndNode(node: Node): void {
    if (node.getIsFinishNode()) {
      this.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        isFinishNode: false,
      });
    }
  }

  addWall(node: Node): void {
    if (!node.isWall()) {
      this.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        weight: NodeWeights.WALL,
      });
    }
  }

  removeWall(node: Node): void {
    if (node.isWall()) {
      this.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        weight: NodeWeights.EMPTY,
        previousNode: null,
      });
    }
  }

  clearPath(): void {
    this.clearBoard();
  }

  onAlgorithmSelected(algo: PathAlgorithmEnum): void {
    this.selectedPathAlgo = algo;
  }

  onMazeAlgoSelected(mazeAlgo: MazeGenerationEnum): void {
    this.animateMazeBuilding(this.getMaze(mazeAlgo));
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

  animateMazeBuilding(maze: GridMap): void {
    from(maze.values()).pipe(
      filter(node => node.isWall()),
      concatMap(node => of(node).pipe(delay(5))),
    ).subscribe(node => {
      this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
    });
  }

  onAnimSpeedSelected(animSpeed: string) {
    console.log(animSpeed);
  }

  private getGridSize(): {row: number, col: number} {
    return {
      row: GridBuilder.calculateAmountOfRows(window.innerHeight),
      col: GridBuilder.calculateAmountOfColumns(window.innerWidth),
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

  disableButtons(): void {
    this.isButtonsDisabled = true;
  }

  activateButtons(): void {
    this.isButtonsDisabled = false;
  }

  isGridSizeFixed(a: GridSize, b: GridSize): boolean {
    return a.totalCol === b.totalCol && a.totalRow === b.totalRow;
  }

  isIdxOutOfGrid({oldIdx, newIdx}: {oldIdx: number, newIdx: number}): boolean {
    return oldIdx > newIdx;
  }

  getNodeIdxAfterResize({oldIdx, newIdx}: {oldIdx: number, newIdx: number}): number {
    return this.isIdxOutOfGrid({oldIdx, newIdx}) ? newIdx : oldIdx;
  }

  updateGridAfterResize({totalCol, totalRow}: GridSize) {
    this.updateGridSize({totalCol, totalRow});
    this.updateDestinationNodesAfterResize({newRowIdx: totalRow - 1, newColIdx: totalCol - 1});
  }

  updateDestinationNodesAfterResize({newRowIdx, newColIdx}: {newRowIdx: number, newColIdx: number}) {
    const newStartNode = GridBuilder.generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.startNode.rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.startNode.colIdx, newIdx: newColIdx}),
      isStartNode: true,
    });

    const newEndNode = GridBuilder.generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.finishNode.rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.finishNode.colIdx, newIdx: newColIdx}),
      isFinishNode: true,
    });

    this.finishNode = Utils.getNodeCoordinates(newEndNode);
    this.startNode = Utils.getNodeCoordinates(newStartNode);

    this.setDestinationNode(this.finishNode);
    this.setDestinationNode(this.startNode);
  }

  decreaseGridHeight(newRowCount: number): void {
    this.nodes.length = newRowCount;
  }

  decreaseGridLength(newColCount: number): void {
    this.nodes.forEach(row => {
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
      this.nodes.forEach((row, idx) => {
        row.push(
          GridBuilder.generateGridNode({
            rowIdx: idx,
            colIdx: currentAmountOfCols + i,
          }),
        );
      });
    }
  }

  updateGridSize({totalCol, totalRow}: GridSize) {
    const {
      totalCol: currentAmountOfCols,
      totalRow: currentAmountOfRows,
    } = Utils.getGridSize(this.nodes);

    if (currentAmountOfRows > totalRow) {
      this.decreaseGridHeight(totalRow);
    } else if (currentAmountOfRows < totalRow) {
      this.nodes.push(
        ...this.increaseGridHeight({totalRow, currentAmountOfCols, currentAmountOfRows}),
      );
    }

    if (currentAmountOfCols < totalCol) {
      this.increaseGridLength({totalCol, currentAmountOfCols});
    } else if (currentAmountOfCols > totalCol) {
      this.decreaseGridLength(totalCol);
    }
  }

  private getStartNode(): Node {
    return this.nodes[this.startNode.rowIdx][this.startNode.colIdx];
  }

  private getEndNode(): Node {
    return this.nodes[this.finishNode.rowIdx][this.finishNode.colIdx];
  }

  private isSameNode(node: any): boolean {
    return this.prevNode.row !== node.row || this.prevNode.col !== node.col;
  }
}
