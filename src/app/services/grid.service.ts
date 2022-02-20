import {Injectable} from '@angular/core';
import {concat, concatMap, delay, filter, from, Observable, of, Subject, tap} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from '../header/header.component';
import {Grid, GridMap} from '../models/grid.types';
import {GridBuilder} from '../grid-builder';
import {BacktrackingIterative} from '../algorithms/maze-generation/backtracking/backtracking-iterative.class';
import {BacktrackingRecursive} from '../algorithms/maze-generation/backtracking/backtracking-recursive.class';
import {Kruskal} from '../algorithms/maze-generation/kruskal/kruskal';
import {Prim} from '../algorithms/maze-generation/prim/prim';
import {Node} from '../models/Node.class';
import {Dijkstra} from '../algorithms/dijkstra/dijkstra';
import {AStar} from '../algorithms/a-star/a-star';
import {UnweightedAlgorithms} from '../algorithms/unweighted/unweighted-algorithms';
import {NodeCoordinates, StoreService} from './store.service';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private destroy$ = new Subject<void>();
  nodes: Grid = [];
  prevNode = {col: null, row: null};
  prevHead = {col: null, row: null};
  prevEnd = {col: null, row: null};
  moveHead = false;
  moveEnd = false;

  constructor(
    private storeService: StoreService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initGrid() {
    this.nodes = GridBuilder.generateGrid(this.getGridSize());
    this.storeService.updateStartNode(this.generateStartNode(this.getGridSize()));
    this.storeService.updateEndNode(this.generateEndNode(this.getGridSize()));
    this.setDestinationNode(this.storeService.getStartNode());
    this.setDestinationNode(this.storeService.getEndNode());
  }

  private getGridSize(): {row: number, col: number} {
    return {
      row: GridBuilder.calculateAmountOfRows(window.innerHeight),
      col: GridBuilder.calculateAmountOfColumns(window.innerWidth),
    };
  }

  generateStartNode(gridSize: {row: number, col: number}): NodeCoordinates {
    return {
      colIdx: 0,
      rowIdx: Math.floor(gridSize.row / 2),
    };
  }

  generateEndNode(gridSize: {row: number, col: number}): NodeCoordinates {
    return {
      colIdx: gridSize.col - 1,
      rowIdx: Math.floor(gridSize.row / 2),
    };
  }

  setDestinationNode({rowIdx, colIdx}: NodeCoordinates) {
    this.nodes[rowIdx][colIdx] = GridBuilder.generateGridNode({
      rowIdx: rowIdx,
      colIdx: colIdx,
      isStartNode: this.isStartNode({rowIdx, colIdx}),
      isFinishNode: this.isEndNode({rowIdx, colIdx}),
    });
  }

  isStartNode({rowIdx, colIdx}: NodeCoordinates) {
    return rowIdx === this.storeService.getStartNode().rowIdx && this.storeService.getStartNode().colIdx === colIdx;
  }

  isEndNode({rowIdx, colIdx}: NodeCoordinates) {
    return rowIdx === this.storeService.getEndNode().rowIdx && this.storeService.getEndNode().colIdx === colIdx;
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
      // TODO: add default
    }
  }

  private getStartNode(): Node {
    return this.nodes[this.storeService.getStartNode().rowIdx][this.storeService.getStartNode().colIdx];
  }

  private getEndNode(): Node {
    return this.nodes[this.storeService.getEndNode().rowIdx][this.storeService.getEndNode().colIdx];
  }

  getShortestPath(selectedPathAlgo: PathAlgorithmEnum | null): [Node[], Node[]] {
    const algorithmData = {
      grid: this.nodes,
      startNode: this.getStartNode(),
      endNode: this.getEndNode(),
    };

    switch (selectedPathAlgo) {
      case PathAlgorithmEnum.DIJKSTRA:
        return new Dijkstra(algorithmData).traverse();
      case PathAlgorithmEnum.A_STAR:
        return new AStar(algorithmData).traverse();
      case PathAlgorithmEnum.BFS:
        return new UnweightedAlgorithms(algorithmData).bfs();
      case PathAlgorithmEnum.DFS:
        return new UnweightedAlgorithms(algorithmData).dfs();
      default:
        throw new Error(`Unknown algorithm type. Given ${selectedPathAlgo}`);
    }
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

  addEndNode($event: any) {
    this.prevEnd = $event;
    this.storeService.updateEndNode({colIdx: $event.col, rowIdx: $event.row});
    this.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeEndNode(node: Node): void {
    if (node.getIsFinishNode()) {
      this.nodes[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        isFinishNode: false,
      });
    }
  }

  addHeadNode($event: any) {
    this.storeService.updateStartNode({colIdx: $event.col, rowIdx: $event.row});
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

  animatePathfindingAlgo(selectedPathAlgo: PathAlgorithmEnum | null): Observable<any> {
    const [visitedNodesInOrder, shortestPath] = this.getShortestPath(selectedPathAlgo);

    return concat(
      this.getAnimationObservable(visitedNodesInOrder),
      this.getAnimationObservable(shortestPath),
    );
  }

  animateMazeBuilding(mazeAlgo: MazeGenerationEnum): Observable<any> {
    return from(this.getMaze(mazeAlgo).values()).pipe(
      filter(node => node.isWall()),
      concatMap(node => of(node).pipe(delay(5))),
      tap(node => {
        this.nodes[node.getRowIdx()][node.getColumnIdx()] = node;
      }),
    );
  }
}
