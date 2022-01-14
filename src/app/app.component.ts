import {Component, Inject, OnInit} from '@angular/core';
import {Node} from './models/Node.class';
import {dijkstra} from './algorithms/dijkstra';
import {Grid} from './models/grid.types';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private startNode = {colIdx: 15, rowIdx: 10};
  private finishNode = {colIdx: 25, rowIdx: 10};
  nodes = this.generateGrid();

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {}

  generateGrid(): Grid {
    const numOfRows = this.calculateAmountOfRows(window);
    const numOfCols = this.calculateAmountOfColumns(window);

    const nodes = this.generateEmptyGrid({row: numOfRows, col: numOfCols});

    for (let rowIdx = 0; rowIdx < numOfRows; rowIdx++) {
      for (let colIdx = 0; colIdx < numOfCols; colIdx++) {
        nodes[rowIdx][colIdx] = new Node({
          rowIdx,
          colIdx,
          isStartNode: rowIdx === this.startNode.rowIdx && colIdx === this.startNode.colIdx,
          isFinishNode: rowIdx === this.finishNode.rowIdx && colIdx === this.finishNode.colIdx,
        });
      }
    }

    return nodes;
  }

  private generateEmptyGrid({row, col}: {row: number, col: number}) {
    return Array(row)
    .fill(0)
    .map(() => Array(col).fill(null));
  }

  calculateAmountOfRows(element: Window) {
    return Math.floor((element.innerHeight * .8) / 30);
  }

  calculateAmountOfColumns(element: Window) {
    return Math.floor(element.innerWidth / 30);
  }

  private getStartNode(): Node {
    return this.nodes[this.startNode.rowIdx][this.startNode.colIdx];
  }

  private getEndNode(): Node {
    return this.nodes[this.finishNode.rowIdx][this.finishNode.colIdx];
  }

  runAlgo() {
    const startNode = this.getStartNode();
    const endNode = this.getEndNode();
    const visitedNodesInOrder = dijkstra({
      grid: this.nodes,
      startNode,
      endNode,
    });

    for (const node of visitedNodesInOrder) {
      this.nodes[node.getRowIdx()][node.getColumnIdx()].isVisited = true;
    }
  }
}
