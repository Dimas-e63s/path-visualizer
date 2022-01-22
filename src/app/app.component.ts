import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node, NodeWeights} from './models/Node.class';
import {Dijkstra} from './algorithms/dijkstra/dijkstra';
import {Grid, GridRow} from './models/grid.types';
import {distinctUntilChanged, fromEvent, map, Subject, takeUntil} from 'rxjs';
import {Backtracking} from './algorithms/maze-generation/backtracking/backtracking';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private startNode = {colIdx: 2, rowIdx: 20};
  private finishNode = {colIdx: 11, rowIdx: 0};
  private destroy$ = new Subject<void>();
  nodes = this.generateGrid();
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        map(({target}) => target as Window),
        map(target => ({cols: this.calculateAmountOfColumns(target), rows: this.calculateAmountOfRows(target)})),
        distinctUntilChanged((a, b) => {
          return a.cols === b.cols && a.rows === b.rows
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(val => {
        const currentAmountOfRows = this.nodes.length
        const currentAmountOfCols = this.nodes[0].length
        const newStartNode = this.getStartNode().clone({
          rowIdx: this.startNode.rowIdx > val.rows - 1 ? val.rows - 1 : this.startNode.rowIdx,
          colIdx: this.startNode.colIdx > val.cols - 1 ? val.cols - 1 : this.startNode.colIdx
        });

        const newEndNode = this.getEndNode().clone({
          rowIdx: this.finishNode.rowIdx > val.rows - 1 ? val.rows - 1 : this.finishNode.rowIdx,
          colIdx: this.finishNode.colIdx > val.cols - 1 ? val.cols - 1 : this.finishNode.colIdx
        });


        // adopt rows
        if (currentAmountOfRows > val.rows) {
          this.nodes.length = val.rows;
        } else if (currentAmountOfRows < val.rows) {
          const newGrid = this.generateEmptyGrid({row: val.rows - currentAmountOfRows, col: currentAmountOfCols});
          for (let rowIdx = 0; rowIdx < newGrid.length; rowIdx++) {
            for (let colIdx = 0; colIdx < newGrid[0].length; colIdx++) {
              newGrid[rowIdx][colIdx] = this.generateGridNode({row: currentAmountOfRows + rowIdx, col: colIdx})
            }
          }
          this.nodes.push(...newGrid);
        }

        // adopt columns
        if (currentAmountOfCols < val.cols) {
          for(let i = 0; i < val.cols - currentAmountOfCols; i++) {
            this.nodes.forEach((row, idx) => {
              row.push(
                this.generateGridNode({
                  row: idx,
                  col: currentAmountOfCols + i
                })
              )
            });
          }
        } else if (currentAmountOfCols > val.cols) {
          this.nodes.forEach(row => {
            row.length = val.cols
          })
        }

        if (this.finishNode.rowIdx > val.rows - 1 || this.finishNode.colIdx > val.cols - 1) {
          this.nodes[newEndNode.getRowIdx()][newEndNode.getColumnIdx()] = newEndNode;
          this.finishNode = {colIdx: newEndNode.getColumnIdx(), rowIdx: newEndNode.getRowIdx()};
        }

        if (this.startNode.rowIdx > val.rows - 1 || this.startNode.colIdx > val.cols - 1) {
          this.nodes[newStartNode.getRowIdx()][newStartNode.getColumnIdx()] = newStartNode;
          this.startNode = {colIdx: newStartNode.getColumnIdx(), rowIdx: newStartNode.getRowIdx()};
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete()
  }

  generateGrid(): Grid {
    const {row, col} = this.getGridSize();
    const nodes = this.generateEmptyGrid({row, col});

    for (let rowIdx = 0; rowIdx < row; rowIdx++) {
      for (let colIdx = 0; colIdx < col; colIdx++) {
        nodes[rowIdx][colIdx] = this.generateGridNode({row: rowIdx, col: colIdx})
      }
    }

    return nodes;
  }

  runAlgo() {
    const startNode = this.getStartNode();
    const endNode = this.getEndNode();
    const [visitedNodesInOrder, shortestPath] = new Dijkstra({
      grid: this.nodes,
      startNode,
      endNode,
    }).traverse();

    const timeout = (index: number) =>
      setTimeout(() =>  {
        if (index === visitedNodesInOrder.length){
          if (shortestPath.length > 0) {
            timeout2(0)
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
      setTimeout(() =>  {
        if (index === shortestPath.length){
          return;
        }
        const node = (shortestPath[index] as Node).clone({isShortestPath: true});
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
        timeout2(index + 1);
      }, 40);
  }

  onAddedWall({col, row}: {col: number, row: number}) {
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
      const copy = selectedNode.clone();
      copy.setAsWall();
      this.nodes[row][col] = copy;
    }
  }

  startEditing(): void {
    if (!this.moveHead && !this.moveEnd) {
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
      // debugger
      this.prevHead = $event;
      const selectedNode = this.nodes[$event.row][$event.col];
      const copy = selectedNode.clone({isStartNode: true});
      this.nodes[oldHead.getRowIdx()][oldHead.getColumnIdx()] = oldHead;
      this.nodes[$event.row][$event.col] = copy;
      this.startNode = {colIdx: $event.col, rowIdx: $event.row};
    } else if (this.moveEnd && (this.prevEnd.row !== $event.row || this.prevEnd.col !== $event.col)) {
      //@ts-ignore
      let oldEnd = this.nodes[this.prevEnd.row][this.prevEnd.col];
      oldEnd = oldEnd.clone({isFinishNode: false});
      this.prevEnd = $event;
      const selectedNode = this.nodes[$event.row][$event.col];
      const copy = selectedNode.clone({isFinishNode: true});
      this.nodes[oldEnd.getRowIdx()][oldEnd.getColumnIdx()] = oldEnd;
      this.nodes[$event.row][$event.col] = copy;
      this.finishNode = {colIdx: $event.col, rowIdx: $event.row};
    } else if (this.isSameNode($event) && this.buildWalls) {
      this.prevNode = $event;
      const selectedNode = this.nodes[$event.row][$event.col];
      const copy = selectedNode.clone();
      copy.setAsWall();
      this.nodes[$event.row][$event.col] = copy;
    }
  }

  clearBoard() {
    this.nodes = this.generateGrid();
  }

  trackByRow(index: number, row: GridRow) {
    return row.length;
  }

  trackByNode(index: number, node: Node) {
    return node.id;
  }

  private calculateAmountOfColumns(element: Window) {
    return Math.floor(element.innerWidth / 30);
  }

  private calculateAmountOfRows(element: Window) {
    return Math.floor((element.innerHeight * .8) / 30);
  }

  private getGridSize(): {row: number, col: number} {
    return {
      row: this.calculateAmountOfRows(window),
      col: this.calculateAmountOfColumns(window)
    }
  }

  private generateGridNode({row, col}: {row: number, col: number}): Node {
    return new Node({
      rowIdx: row,
      colIdx: col,
      isStartNode: row === this.startNode.rowIdx && col === this.startNode.colIdx,
      isFinishNode: row === this.finishNode.rowIdx && col === this.finishNode.colIdx,
    });
  }

  private generateEmptyGrid({row, col}: {row: number, col: number}) {
    return Array(row)
      .fill(0)
      .map(() => Array(col).fill(null));
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

  clearWalls() {
    for(const row of this.nodes) {
      for (const column of row) {
        if (column.isWall()) {
          this.nodes[column.getRowIdx()][column.getColumnIdx()] = column.clone({weight: NodeWeights.EMPTY, previousNode: null})
        }
      }
    }
  }

  clearPath() {
    this.clearBoard();
    const maze = new Backtracking(this.nodes, this.getStartNode(), this.getEndNode()).getMaze();
    const nodesToAnimate: GridRow = [];
    for (const node of maze.values()) {
      nodesToAnimate.push(node);
    }

    const timeout = (index: number) =>
      setTimeout(() =>  {
        if (index === nodesToAnimate.length){
          return;
        }
        const node = nodesToAnimate[index] as Node;
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
        timeout(index + 1);
      }, 0);

    timeout(0);
  }
}
