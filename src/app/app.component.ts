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
import {GridService} from './services/grid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  selectedPathAlgo: PathAlgorithmEnum | null = null;
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;
  isButtonsDisabled = false;

  constructor(private gridService: GridService) {
  }

  ngOnInit(): void {
    this.gridService.initGrid();
    fromEvent(window, 'resize')
      .pipe(
        map(({target}) => target as Window),
        map(({innerHeight, innerWidth}) => ({
          totalCol: GridBuilder.calculateAmountOfColumns(innerWidth),
          totalRow: GridBuilder.calculateAmountOfRows(innerHeight),
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

  getNodes(): Grid {
    return this.gridService.nodes;
  }

  getShortestPath(): [Node[], Node[]] {
    const algorithmData = {
      grid: this.gridService.nodes,
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
      default:
        throw new Error(`Unknown algorithm type. Given ${this.selectedPathAlgo}`);
    }
  }

  runAlgo() {
    if (this.selectedPathAlgo) {
      this.disableButtons();
      this.animatePathfindingAlgo();
    }
  }

  animatePathfindingAlgo() {
    const [visitedNodesInOrder, shortestPath] = this.getShortestPath();

    concat(
      this.getAnimationObservable(visitedNodesInOrder),
      this.getAnimationObservable(shortestPath),
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
          this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
        }),
      );
  }

  onAddedWall({col, row}: {col: number, row: number}) {
    if (this.isButtonsDisabled) {
      return;
    }

    const selectedNode = this.gridService.nodes[row][col];
    if (selectedNode.getIsStartNode()) {
      this.moveHead = true;
      // @ts-ignore
      this.prevHead = {col, row};
    } else if (selectedNode.getIsFinishNode()) {
      this.moveEnd = true;
      // @ts-ignore
      this.prevEnd = {col, row};
    } else {
      this.addWall(this.gridService.nodes[row][col]);
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
      this.removeHeadNode(this.gridService.nodes[this.prevHead.row][this.prevHead.col]);
      this.addHeadNode($event);
    } else if (this.moveEnd && (this.prevEnd.row !== $event.row || this.prevEnd.col !== $event.col)) {
      //@ts-ignore
      this.removeEndNode(this.gridService.nodes[this.prevEnd.row][this.prevEnd.col]);
      this.addEndNode($event);
    } else if (this.isSameNode($event) && this.buildWalls) {
      this.prevNode = $event;
      this.addWall(this.gridService.nodes[$event.row][$event.col]);
    }
  }

  clearBoard() {
    this.gridService.initGrid();
  }

  trackByRow(index: number, row: GridRow) {
    return row.length;
  }

  trackByNode(index: number, node: Node) {
    return node.id;
  }

  clearWalls() {
    this.disableButtons();
    for (const row of this.gridService.nodes) {
      for (const column of row) {
        this.removeWall(column);
      }
    }
    this.activateButtons();
  }

  addHeadNode($event: any) {
    this.gridService.startNode = {colIdx: $event.col, rowIdx: $event.row};
    this.prevHead = $event;
    this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeHeadNode(node: Node): void {
    if (node.getIsStartNode()) {
      this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        isStartNode: false,
      });
    }
  }

  addEndNode($event: any) {
    this.prevEnd = $event;
    this.gridService.finishNode = {colIdx: $event.col, rowIdx: $event.row};
    this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeEndNode(node: Node): void {
    if (node.getIsFinishNode()) {
      this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        isFinishNode: false,
      });
    }
  }

  addWall(node: Node): void {
    if (!node.isWall()) {
      const nodeClone = node.clone();
      nodeClone.setAsWall();
      this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = nodeClone;
    }
  }

  removeWall(node: Node): void {
    if (node.isWall()) {
      this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        weight: NodeWeights.EMPTY,
        previousNode: null,
      });
    }
  }

  clearPath(): void {
    for (const row of this.gridService.nodes) {
      for (const node of row) {
        if (!node.isWall() || node.isVisitedNode() || node.isShortestPath) {
          this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
            isShortestPath: false,
            previousNode: null,
            isVisitedNode: false,
            distance: Infinity,
          });
        }
      }
    }
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
        return new BacktrackingIterative(this.gridService.nodes, this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.BACKTRACKING_REC:
        return new BacktrackingRecursive(this.gridService.nodes, this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.KRUSKAL:
        return new Kruskal(this.gridService.nodes, this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.PRIM:
        return new Prim(this.gridService.nodes, this.getStartNode(), this.getEndNode()).getMaze();
    }
  }

  animateMazeBuilding(maze: GridMap): void {
    this.disableButtons();
    from(maze.values()).pipe(
      filter(node => node.isWall()),
      concatMap(node => of(node).pipe(delay(5))),
      finalize(() => this.activateButtons()),
    ).subscribe(node => {
      this.gridService.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
    });
  }

  onAnimSpeedSelected(animSpeed: string) {
    console.log(animSpeed);
  }

  setDestinationNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    this.gridService.nodes[rowIdx][colIdx] = GridBuilder.generateGridNode({
      rowIdx: rowIdx,
      colIdx: colIdx,
      isStartNode: this.isStartNode({rowIdx, colIdx}),
      isFinishNode: this.isEndNode({rowIdx, colIdx}),
    });
  }

  isStartNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    return rowIdx === this.gridService.startNode.rowIdx && this.gridService.startNode.colIdx === colIdx;
  }

  isEndNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    return rowIdx === this.gridService.finishNode.rowIdx && this.gridService.finishNode.colIdx === colIdx;
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

    this.setDestinationNode(this.gridService.finishNode);
    this.setDestinationNode(this.gridService.startNode);
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

  private getStartNode(): Node {
    return this.gridService.nodes[this.gridService.startNode.rowIdx][this.gridService.startNode.colIdx];
  }

  private getEndNode(): Node {
    return this.gridService.nodes[this.gridService.finishNode.rowIdx][this.gridService.finishNode.colIdx];
  }

  private isSameNode(node: any): boolean {
    return this.prevNode.row !== node.row || this.prevNode.col !== node.col;
  }
}
