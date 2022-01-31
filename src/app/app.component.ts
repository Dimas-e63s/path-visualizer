import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node, NodeInterface, NodeWeights} from './models/Node.class';
import {Dijkstra} from './algorithms/dijkstra/dijkstra';
import {Grid, GridMap, GridRow, GridSize} from './models/grid.types';
import {distinctUntilChanged, fromEvent, map, Subject, takeUntil} from 'rxjs';
import {Backtracking} from './algorithms/maze-generation/backtracking/backtracking';
import {MazeGenerationEnum, PathAlgorithmEnum} from './header/header.component';
import {Kruskal} from './algorithms/maze-generation/kruskal/kruskal';
import {Prim} from './algorithms/maze-generation/prim/prim';
import {AStar} from './algorithms/a-star/a-star';
import {UnweightedAlgorithms} from './algorithms/unweighted/unweighted-algorithms';
import {Utils} from './algorithms/utils/utils.class';

// TODO: - to get rid of duplicated node gen logic
//          - create init grid method
//          - call destication with start and end

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private startNode = {colIdx: 2, rowIdx: 25};
  private finishNode = {colIdx: 55, rowIdx: 0};
  private destroy$ = new Subject<void>();
  private selectedPathAlgo: PathAlgorithmEnum = PathAlgorithmEnum.BFS;
  nodes = this.generateGrid(this.getGridSize());
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;
  isButtonsDisabled = false;

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        map(({target}) => target as Window),
        map(target => ({
          totalCol: this.calculateAmountOfColumns(target.innerWidth),
          totalRow: this.calculateAmountOfRows(target.innerHeight),
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

  generateGrid({row, col}: {row: number, col: number}): Grid {
    const nodes = this.generateEmptyGrid({row, col});

    for (let rowIdx = 0; rowIdx < row; rowIdx++) {
      for (let colIdx = 0; colIdx < col; colIdx++) {
        nodes[rowIdx][colIdx] = this.generateGridNode({row: rowIdx, col: colIdx});
      }
    }

    return nodes;
  }

  runAlgo() {
    this.isButtonsDisabled = true;
    const startNode = this.getStartNode();
    const endNode = this.getEndNode();

    let visitedNodesInOrder: GridRow;
    let shortestPath: GridRow;

    switch (this.selectedPathAlgo) {
      case PathAlgorithmEnum.DIJKSTRA:
        [visitedNodesInOrder, shortestPath] = new Dijkstra({
          grid: this.nodes,
          startNode,
          endNode,
        }).traverse();
        break;
      case PathAlgorithmEnum.A_STAR:
        [visitedNodesInOrder, shortestPath] = new AStar({
          grid: this.nodes,
          startNode,
          endNode,
        }).traverse();
        break;
      case PathAlgorithmEnum.BFS:
        [visitedNodesInOrder, shortestPath] = new UnweightedAlgorithms({
          grid: this.nodes,
          startNode,
          endNode,
        }).bfs();
        break;
      case PathAlgorithmEnum.DFS:
        [visitedNodesInOrder, shortestPath] = new UnweightedAlgorithms({
          grid: this.nodes,
          startNode,
          endNode,
        }).dfs();
        break;
    }

    const timeout = (index: number) =>
      setTimeout(() => {
        if (index === visitedNodesInOrder.length) {
          if (shortestPath.length > 0) {
            timeout2(0);
          }
          return;
        }
        const node = visitedNodesInOrder[index] as Node;
        const copy = this.nodes[node.getRowIdx()][node.getColumnIdx()].clone();
        copy.setAsVisited();
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = copy;
        timeout(index + 1);
      }, 15);

    timeout(0);

    const timeout2 = (index: number) =>
      setTimeout(() => {
        if (index === shortestPath.length) {
          this.isButtonsDisabled = false;
          return;
        }
        const node = (shortestPath[index] as Node).clone({isShortestPath: true});
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
        timeout2(index + 1);
      }, 40);
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
      this.nodes[row][col] = selectedNode.clone({weight: NodeWeights.WALL});
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
      let oldHead = this.nodes[this.prevHead.row][this.prevHead.col];
      oldHead = oldHead.clone({isStartNode: false});
      this.nodes[oldHead.getRowIdx()][oldHead.getColumnIdx()] = oldHead;


      this.startNode = {colIdx: $event.col, rowIdx: $event.row};
      this.prevHead = $event;
      this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
    } else if (this.moveEnd && (this.prevEnd.row !== $event.row || this.prevEnd.col !== $event.col)) {
      //@ts-ignore
      let oldEnd = this.nodes[this.prevEnd.row][this.prevEnd.col];
      oldEnd = oldEnd.clone({isFinishNode: false});
      this.nodes[oldEnd.getRowIdx()][oldEnd.getColumnIdx()] = oldEnd;

      this.prevEnd = $event;
      this.finishNode = {colIdx: $event.col, rowIdx: $event.row};
      this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
    } else if (this.isSameNode($event) && this.buildWalls) {
      this.prevNode = $event;
      const selectedNode = this.nodes[$event.row][$event.col];
      this.nodes[$event.row][$event.col] = selectedNode.clone({weight: NodeWeights.WALL});
    }
  }

  clearBoard() {
    this.nodes = this.generateGrid(this.getGridSize());
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
        if (column.isWall()) {
          this.nodes[column.getRowIdx()][column.getColumnIdx()] = column.clone({weight: NodeWeights.EMPTY, previousNode: null});
        }
      }
    }
    this.isButtonsDisabled = false;
  }

  clearPath() {
    this.clearBoard();
  }

  onAlgorithmSelected(algo: PathAlgorithmEnum) {
    this.selectedPathAlgo = algo;
  }

  onMazeAlgoSelected(mazeAlgo: string) {
    let maze: GridMap;

    switch (mazeAlgo) {
      case MazeGenerationEnum.BACKTRACKING_ITR:
        maze = new Backtracking(this.nodes, this.getStartNode(), this.getEndNode()).getMazeIterative();
        break;
      case MazeGenerationEnum.BACKTRACKING_REC:
        maze = new Backtracking(this.nodes, this.getStartNode(), this.getEndNode()).getMazeRecursive();
        break;
      case MazeGenerationEnum.KRUSKAL:
        maze = new Kruskal(this.nodes, this.getStartNode(), this.getEndNode()).helper();
        break;
      case MazeGenerationEnum.PRIM:
        maze = new Prim(this.nodes, this.getStartNode(), this.getEndNode()).helper();
        break;
    }

    const nodesToAnimate: GridRow = [];
    for (const node of maze!.values()) {
      nodesToAnimate.push(node);
    }

    const timeout = (index: number) =>
      setTimeout(() => {
        if (index === nodesToAnimate.length) {
          return;
        }
        const node = nodesToAnimate[index] as Node;
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
        timeout(index + 1);
      }, 0);

    timeout(0);
  }

  onAnimSpeedSelected(animSpeed: string) {
    console.log(animSpeed);
  }

  calculateAmountOfColumns(width: number) {
    return Math.floor(width / 30);
  }

  calculateAmountOfRows(height: number) {
    return Math.floor((height * .8) / 30);
  }

  private getGridSize(): {row: number, col: number} {
    return {
      row: this.calculateAmountOfRows(window.innerHeight),
      col: this.calculateAmountOfColumns(window.innerWidth),
    };
  }

  private generateGridNode({row, col}: {row: number, col: number}): Node {
    return new Node({
      rowIdx: row,
      colIdx: col,
      isStartNode: row === this.startNode.rowIdx && col === this.startNode.colIdx,
      isFinishNode: row === this.finishNode.rowIdx && col === this.finishNode.colIdx,
    });
  }

  _generateGridNode(metaData: NodeInterface) {
    // TODO: - should become one version
    return new Node(metaData);
  }

  generateEmptyGrid({row, col}: {row: number, col: number}) {
    // TODO: - add validation for passed params
    return Array(row)
      .fill(0)
      .map(() => Array(col).fill(null));
  }

  setDestinationNode({rowIdx, colIdx}: {rowIdx: number, colIdx: number}) {
    this.nodes[rowIdx][colIdx] = this._generateGridNode({
      rowIdx: rowIdx,
      colIdx: colIdx,
      isStartNode: rowIdx === this.startNode.rowIdx && this.startNode.colIdx === colIdx,
      isFinishNode: rowIdx === this.finishNode.rowIdx && this.finishNode.colIdx === colIdx,
    });
  }

  disableButtons(): void {
    this.isButtonsDisabled = true;
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
    const newStartNode = this._generateGridNode({
      rowIdx: this.getNodeIdxAfterResize({oldIdx: this.startNode.rowIdx, newIdx: newRowIdx}),
      colIdx: this.getNodeIdxAfterResize({oldIdx: this.startNode.colIdx, newIdx: newColIdx}),
      isStartNode: true,
    });

    const newEndNode = this._generateGridNode({
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
    const newGrid = this.generateEmptyGrid({row: totalRow - currentAmountOfRows, col: currentAmountOfCols});

    for (let rowIdx = 0; rowIdx < newGrid.length; rowIdx++) {
      for (let colIdx = 0; colIdx < newGrid[0].length; colIdx++) {
        newGrid[rowIdx][colIdx] = this.generateGridNode({row: currentAmountOfRows + rowIdx, col: colIdx});
      }
    }

    return newGrid;
  }

  increaseGridLength({totalCol, currentAmountOfCols}: {totalCol: number, currentAmountOfCols: number}) {
    for (let i = 0; i < totalCol - currentAmountOfCols; i++) {
      this.nodes.forEach((row, idx) => {
        row.push(
          this.generateGridNode({
            row: idx,
            col: currentAmountOfCols + i,
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
