import {Component} from '@angular/core';
import {Node} from './models/Node.class';
import {dijkstra} from './algorithms/dijkstra';
import {Grid, GridRow} from './models/grid.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private startNode = {colIdx: 5, rowIdx: 10};
  private finishNode = {colIdx: 25, rowIdx: 2};
  nodes = this.generateGrid();
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;

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
    const visitedNodesInOrder = dijkstra({
      grid: this.nodes,
      startNode,
      endNode,
    });

    debugger

    for (let i = 0; i < visitedNodesInOrder[0].length; i++) {
      const node = visitedNodesInOrder[0][i];
      const copy = this.nodes[node.getRowIdx()][node.getColumnIdx()].clone();
      copy.setAsVisited();
      setTimeout(() => {
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = copy;
      }, 7 * i);
    }

    debugger
    for (let i = 0; i < visitedNodesInOrder[1].length; i++) {
      const node = visitedNodesInOrder[1][i];
      const copy = this.nodes[node.getRowIdx()][node.getColumnIdx()].clone({isShortestPath: true});
      setTimeout(() => {
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = copy;
      }, 50 * i);
    }
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
}
