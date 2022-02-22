import {Component, OnInit} from '@angular/core';
import {Node, NodeWeights} from './models/Node.class';
import {Grid, GridRow} from './models/grid.types';
import {
  finalize,
} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from './components/header/header.component';
import {GridService} from './services/grid.service';
import {GridResizeService} from './services/grid-resize.service';
import {StoreService} from './services/store.service';

// TODO:
// - refactor to use pull-based architecture based on observables (eliminate reference change)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedPathAlgo: PathAlgorithmEnum | null = null;
  buildWalls = false;
  moveHead = false;
  moveEnd = false;
  isButtonsDisabled = false;

  constructor(
    private gridService: GridService,
    private gridResizeService: GridResizeService,
    private storeService: StoreService,
  ) {
  }

  ngOnInit(): void {
    this.gridService.initGrid();
    this.gridResizeService.getResizeObservable().subscribe();
  }

  getNodes(): Grid {
    return this.storeService.getGrid();
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

  // TODO: - refactor this function
  onAddedWall({col, row}: {col: number, row: number}) {
    if (this.isButtonsDisabled) {
      return;
    }

    const selectedNode = this.storeService.getGrid()[row][col];
    if (selectedNode.getIsStartNode()) {
      this.moveHead = true;
      // TODO: - refactor function API
      this.storeService.updatePrevHead({col, row});
    } else if (selectedNode.getIsFinishNode()) {
      this.moveEnd = true;
      this.storeService.updatePrevEnd({col, row});
    } else {
      this.addWall(this.storeService.getGrid()[row][col]);
    }
  }

  startEditing(): void {
    if (!this.moveHead && !this.moveEnd && !this.isButtonsDisabled) {
      this.buildWalls = !this.buildWalls;
    }
  }

  stopEdit(): void {
    this.buildWalls = false;
    this.moveHead = false;
    this.moveEnd = false;
  }

  // TODO: - move to grid service
  onDraw($event: any) {
    // TODO: - extract long conditions to query
    if (this.moveHead && (this.storeService.getStartNode().rowIdx !== $event.row || this.storeService.getStartNode().colIdx !== $event.col)) {
      this.gridService.removeHeadNode(this.storeService.getGrid()[this.storeService.getPrevStartNode().row][this.storeService.getPrevStartNode().col]);
      this.gridService.addHeadNode($event);
    } else if (this.moveEnd && (this.storeService.getEndNode().rowIdx !== $event.row || this.storeService.getEndNode().colIdx !== $event.col)) {
      this.gridService.removeEndNode(this.storeService.getGrid()[this.storeService.getPrevEndNode().row][this.storeService.getPrevEndNode().col]);
      this.gridService.addEndNode($event);
    } else if (this.isSameNode($event) && this.buildWalls) {
      this.storeService.updatePrevNode($event);
      this.addWall(this.storeService.getGrid()[$event.row][$event.col]);
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
    for (const row of this.storeService.getGrid()) {
      for (const column of row) {
        this.removeWall(column);
      }
    }
    this.activateButtons();
  }

  // TODO: - move to store
  addWall(node: Node): void {
    if (!node.isWall()) {
      const nodeClone = node.clone();
      nodeClone.setAsWall();
      this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = nodeClone;
    }
  }

  // TODO: - move to store
  removeWall(node: Node): void {
    if (node.isWall()) {
      this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        weight: NodeWeights.EMPTY,
        previousNode: null,
      });
    }
  }

  // TODO: - move to store
  clearPath(): void {
    for (const row of this.storeService.getGrid()) {
      for (const node of row) {
        if (!node.isWall() || node.isVisitedNode() || node.isShortestPath) {
          this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = node.clone({
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
        finalize(() => {
          this.activateButtons();
        }),
    ).subscribe();
  }

  // TODO: - to implement
  onAnimSpeedSelected(animSpeed: string) {}

  disableButtons(): void {
    this.isButtonsDisabled = true;
  }

  activateButtons(): void {
    this.isButtonsDisabled = false;
  }

  private isSameNode(node: any): boolean {
    return this.storeService.getPrevNode().row !== node.row || this.storeService.getPrevNode().col !== node.col;
  }
}
