import {Component, OnInit} from '@angular/core';
import {distinctUntilChanged, fromEvent, map, pluck} from 'rxjs';
import {Node} from './models/Node.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private startNode = {colIdx: 0, rowIdx: 1};
  private finishNode = {colIdx: 40, rowIdx: 13};
  nodes: any;
  ngOnInit() {
    this.generateGrid();
    fromEvent(window, 'resize')
      .pipe(
        pluck('target'),
        map((target) => this.calculateAmountOfColumns(target as Window)),
        distinctUntilChanged()
      )
      .subscribe(size => {
        this.nodes.map((row: any) => {
          row.length = size;
        })
    })
  }

  generateGrid() {
    const numOfRows = this.calculateAmountOfRows(window);
    const numOfCols = this.calculateAmountOfColumns(window);
    const nodes = Array(numOfRows)
      .fill(0)
      .map(() => Array(numOfCols).fill(0));

    for (let rowIdx = 0; rowIdx < numOfRows; rowIdx++) {
      for (let colIdx = 0; colIdx < numOfCols; colIdx++) {
        nodes[rowIdx][colIdx] = (new Node({
          rowIdx,
          colIdx,
          isStartNode: rowIdx === this.startNode.rowIdx && colIdx === this.startNode.colIdx,
          isFinishNode: rowIdx === this.finishNode.rowIdx && colIdx === this.finishNode.colIdx}))
      }
    }
    this.nodes = nodes;
  }

  calculateAmountOfRows(element: Window) {
    return Math.floor((element.innerHeight * .8) / 30);
  }

  calculateAmountOfColumns(element: Window) {
    return Math.floor(element.innerWidth / 30);
  }
}
