import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

export enum MazeGenerationEnum {
  BACKTRACKING_ITR = 'Backtracking Iterative',
  BACKTRACKING_REC = 'Backtracking Recursive',
  KRUSKAL = 'Kruskal\'s Algorithm',
  PRIM = 'Prim\'s Algorithm'
}

export enum PathAlgorithmEnum {
  DIJKSTRA = 'Dijkstra Algorithm',
  A_STAR = 'A* Search Algorithm',
  BFS = 'Breath-first Search',
  DFS = 'Depth-first Search'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input() isButtonsDisabled!: boolean;
  @Output() onAlgoRunButtonWasClicked = new EventEmitter<void>();
  @Output() onClearPathWasClicked = new EventEmitter<void>();
  @Output() onClearWallsWasClicked = new EventEmitter<void>();
  @Output() onAlgorithmSelectedWasClicked = new EventEmitter<PathAlgorithmEnum>();
  @Output() onMazeAlgorithmWasClicked = new EventEmitter<MazeGenerationEnum>();
  @Output() onAnimSpeedWasClicked = new EventEmitter<string>();

  readonly animationSpeedOptions = ['Fast', 'Average', 'Slow'];
  readonly algorithmsOptions = [
    PathAlgorithmEnum.DIJKSTRA,
    PathAlgorithmEnum.A_STAR,
    PathAlgorithmEnum.BFS,
    PathAlgorithmEnum.DFS
  ];
  readonly mazesOptions = [
    MazeGenerationEnum.BACKTRACKING_REC,
    MazeGenerationEnum.BACKTRACKING_ITR,
    MazeGenerationEnum.KRUSKAL,
    MazeGenerationEnum.PRIM,
  ];

  onAlgoClick() {
    this.onAlgoRunButtonWasClicked.emit();
  }

  onClearPath() {
    this.onClearPathWasClicked.emit();
  }

  onClearWalls() {
    this.onClearWallsWasClicked.emit();
  }

  onAlgorithmSelected(algo: PathAlgorithmEnum) {
    this.onAlgorithmSelectedWasClicked.emit(algo);
  }

  onMazeAlgorithmSelected(mazeAlgo: MazeGenerationEnum) {
    this.onMazeAlgorithmWasClicked.emit(mazeAlgo);
  }

  onAnimationSpeedSelected(animationSpeed: string) {
    this.onAnimSpeedWasClicked.emit(animationSpeed);
  }
}
