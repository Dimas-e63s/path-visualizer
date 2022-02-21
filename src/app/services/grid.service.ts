import {Injectable} from '@angular/core';
import {concat, concatMap, delay, filter, from, Observable, of, Subject, tap} from 'rxjs';
import {MazeGenerationEnum, PathAlgorithmEnum} from '../header/header.component';
import {GridMap, GridSize} from '../models/grid.types';
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

// TODO: - change logic for setting grid height to take elementRef of section as source of height

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private destroy$ = new Subject<void>();

  constructor(
    private storeService: StoreService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initGrid() {
    this.storeService.updateGrid(GridBuilder.generateGrid(this.getGridSize()));
    this.storeService.updateStartNode(this.getDefaultStartNode(this.getGridSize()));
    this.storeService.updateEndNode(this.getDefaultEndNode(this.getGridSize()));
    this.storeService.setDestinationNode(this.storeService.getStartNode());
    this.storeService.setDestinationNode(this.storeService.getEndNode());
  }

  private getGridSize(): GridSize {
    return {
      totalRow: GridBuilder.calculateAmountOfRows(window.innerHeight),
      totalCol: GridBuilder.calculateAmountOfColumns(window.innerWidth),
    };
  }

  private getDefaultStartNode({totalRow}: GridSize): NodeCoordinates {
    return {
      colIdx: 0,
      rowIdx: Math.floor(totalRow / 2),
    };
  }

  private getDefaultEndNode({totalRow, totalCol}: GridSize): NodeCoordinates {
    return {
      colIdx: totalCol - 1,
      rowIdx: Math.floor(totalRow / 2),
    };
  }

  getMaze(mazeAlgo: MazeGenerationEnum): GridMap {
    switch (mazeAlgo) {
      case MazeGenerationEnum.BACKTRACKING_ITR:
        return new BacktrackingIterative(this.storeService.getGrid(), this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.BACKTRACKING_REC:
        return new BacktrackingRecursive(this.storeService.getGrid(), this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.KRUSKAL:
        return new Kruskal(this.storeService.getGrid(), this.getStartNode(), this.getEndNode()).getMaze();
      case MazeGenerationEnum.PRIM:
        return new Prim(this.storeService.getGrid(), this.getStartNode(), this.getEndNode()).getMaze();
      default:
        throw new Error(`Unknown maze generation algorithm type. Given ${mazeAlgo}`)
    }
  }

  private getStartNode(): Node {
    return this.storeService.getGrid()[this.storeService.getStartNode().rowIdx][this.storeService.getStartNode().colIdx];
  }

  private getEndNode(): Node {
    return this.storeService.getGrid()[this.storeService.getEndNode().rowIdx][this.storeService.getEndNode().colIdx];
  }

  getShortestPath(selectedPathAlgo: PathAlgorithmEnum | null): [Node[], Node[]] {
    const algorithmData = {
      grid: this.storeService.getGrid(),
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
          this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = node;
        }),
      );
  }

  addEndNode($event: any) {
    this.storeService.updatePrevEnd($event);
    this.storeService.updateEndNode({colIdx: $event.col, rowIdx: $event.row});
    this.storeService.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeEndNode(node: Node): void {
    if (node.getIsFinishNode()) {
      this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = node.clone({
        isFinishNode: false,
      });
    }
  }

  addHeadNode($event: any) {
    this.storeService.updateStartNode({colIdx: $event.col, rowIdx: $event.row});
    this.storeService.updatePrevHead($event);
    this.storeService.setDestinationNode({rowIdx: $event.row, colIdx: $event.col});
  }

  removeHeadNode(node: Node): void {
    if (node.getIsStartNode()) {
      this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = node.clone({
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
        this.storeService.getGrid()[node.getRowIdx()][node.getColumnIdx()] = node;
      }),
    );
  }
}
