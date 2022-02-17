import {Component, OnInit} from '@angular/core';
import {Node, NodeWeights} from './models/Node.class';
import {Dijkstra} from './algorithms/dijkstra/dijkstra';
import {Grid, GridMap, GridRow} from './models/grid.types';
import {
  concat,
  concatMap,
  delay,
  filter,
  finalize,
  from,
  Observable,
  of,
  tap,
} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from './header/header.component';
import {Kruskal} from './algorithms/maze-generation/kruskal/kruskal';
import {Prim} from './algorithms/maze-generation/prim/prim';
import {AStar} from './algorithms/a-star/a-star';
import {UnweightedAlgorithms} from './algorithms/unweighted/unweighted-algorithms';
import {BacktrackingIterative} from './algorithms/maze-generation/backtracking/backtracking-iterative.class';
import {BacktrackingRecursive} from './algorithms/maze-generation/backtracking/backtracking-recursive.class';
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
    private gridResizeService: GridResizeService
  ) {}

  ngOnInit(): void {
    this.gridService.initGrid();
    this.gridResizeService.getResizeObservable().subscribe();
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
    this.gridService.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
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
    this.gridService.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
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

  disableButtons(): void {
    this.isButtonsDisabled = true;
  }

  activateButtons(): void {
    this.isButtonsDisabled = false;
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
