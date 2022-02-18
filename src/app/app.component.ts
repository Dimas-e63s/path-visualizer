import {Component, OnInit} from '@angular/core';
import {Node, NodeWeights} from './models/Node.class';
import {Grid, GridRow} from './models/grid.types';
import {
  finalize,
} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from './header/header.component';
import {GridService} from './services/grid.service';
import {GridResizeService} from './services/grid-resize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedPathAlgo: PathAlgorithmEnum | null = null;
  buildWalls = false;
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;
  isButtonsDisabled = false;

  constructor(
    private gridService: GridService,
    private gridResizeService: GridResizeService,
  ) {
  }

  ngOnInit(): void {
    this.gridService.initGrid();
    this.gridResizeService.getResizeObservable().subscribe();
  }

  getNodes(): Grid {
    return this.gridService.nodes;
  }

  runAlgo() {
    if (this.selectedPathAlgo) {
      this.disableButtons();
      this.gridService.animatePathfindingAlgo(this.selectedPathAlgo).pipe(
        finalize(() => {
          this.activateButtons();
        }),
      ).subscribe();
    }
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
      this.gridService.removeHeadNode(this.gridService.nodes[this.prevHead.row][this.prevHead.col]);
      this.gridService.addHeadNode($event);
    } else if (this.moveEnd && (this.prevEnd.row !== $event.row || this.prevEnd.col !== $event.col)) {
      //@ts-ignore
      this.gridService.removeEndNode(this.gridService.nodes[this.prevEnd.row][this.prevEnd.col]);
      this.gridService.addEndNode($event);
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
    this.disableButtons();
    this.gridService.animateMazeBuilding(mazeAlgo).pipe(
      finalize(() => {this.activateButtons()})
    ).subscribe();
  }

  onAnimSpeedSelected(animSpeed: string) {
    console.log(animSpeed);
  }

  disableButtons(): void {
    this.isButtonsDisabled = true;
  }

  activateButtons(): void {
    this.isButtonsDisabled = false;
  }

  private isSameNode(node: any): boolean {
    return this.prevNode.row !== node.row || this.prevNode.col !== node.col;
  }
}
