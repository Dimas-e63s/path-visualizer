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
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() isButtonsDisabled!: boolean;
  // TODO: - check angular docs for naming convention
  @Output() onAlgoRunButtonWasClicked = new EventEmitter<void>();
  @Output() onClearPathWasClicked = new EventEmitter<void>();
  @Output() onClearWallsWasClicked = new EventEmitter<void>();
  @Output() onClearBoardWasClicked = new EventEmitter<void>();
  @Output() onAlgorithmSelectedWasClicked = new EventEmitter<PathAlgorithmEnum>();
  @Output() onMazeAlgorithmWasClicked = new EventEmitter<MazeGenerationEnum>();
  @Output() onAnimSpeedWasClicked = new EventEmitter<string>();

  active = false;
  readonly animationSpeedOptions = ['Fast', 'Average', 'Slow'];
  readonly algorithmsOptions = [
    PathAlgorithmEnum.DIJKSTRA,
    PathAlgorithmEnum.A_STAR,
    PathAlgorithmEnum.BFS,
    PathAlgorithmEnum.DFS,
  ];
  readonly mazesOptions = [
    MazeGenerationEnum.BACKTRACKING_REC,
    MazeGenerationEnum.BACKTRACKING_ITR,
    MazeGenerationEnum.KRUSKAL,
    MazeGenerationEnum.PRIM,
  ];

  onAlgoClick() {
    this.onAlgoRunButtonWasClicked.emit();
    // TODO: - think on how to reduce repetition of closeNavbar() call
    this.closeNavbar();
  }

  onClearPath() {
    this.onClearPathWasClicked.emit();
    this.closeNavbar();
  }

  onClearWalls() {
    this.onClearWallsWasClicked.emit();
    this.closeNavbar();
  }

  onClearBoard() {
    this.onClearBoardWasClicked.emit();
    this.closeNavbar();
  }

  onAlgorithmSelected(algo: PathAlgorithmEnum) {
    this.onAlgorithmSelectedWasClicked.emit(algo);
    this.closeNavbar();
  }

  onMazeAlgorithmSelected(mazeAlgo: MazeGenerationEnum) {
    this.onMazeAlgorithmWasClicked.emit(mazeAlgo);
    this.closeNavbar();
  }

  onAnimationSpeedSelected(animationSpeed: string) {
    this.onAnimSpeedWasClicked.emit(animationSpeed);
    this.closeNavbar();
  }

  closeNavbar(): void {
    this.active = false;
  }
}
