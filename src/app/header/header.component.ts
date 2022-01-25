import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Output() onAlgoRunButtonWasClicked = new EventEmitter<void>();
  @Output() onClearPathWasClicked = new EventEmitter<void>();
  @Output() onClearWallsWasClicked = new EventEmitter<void>();
  @Output() onAlgorithmSelectedWasClicked = new EventEmitter<string>();
  @Output() onMazeAlgorithmWasClicked = new EventEmitter<string>();
  @Output() onAnimSpeedWasClicked = new EventEmitter<string>();

  readonly animationSpeedOptions = ['Fast', 'Average', 'Slow'];
  readonly algorithmsOptions = ['Dijkstra', 'A* Search', 'Breath-first Search', 'Depth-first Search'];
  readonly mazesOptions = ['Backtracking Recursive', 'Backtracking Iterative', 'Kruskal\'s Algorithm', 'Prim\'s Algorithm']

  onAlgoClick() {
    this.onAlgoRunButtonWasClicked.emit();
  }

  onClearPath() {
    this.onClearPathWasClicked.emit();
  }

  onClearWalls() {
    this.onClearWallsWasClicked.emit();
  }

  onAlgorithmSelected(algo: string) {
    this.onAlgorithmSelectedWasClicked.emit(algo);
  }

  onMazeAlgorithmSelected(mazeAlgo: string) {
    this.onMazeAlgorithmWasClicked.emit(mazeAlgo);
  }

  onAnimationSpeedSelected(animationSpeed: string) {
    this.onAnimSpeedWasClicked.emit(animationSpeed);
  }
}
