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
  speedOptions = ['Fast', 'Average', 'Slow'];
  algorithmsOptions = ['Dijkstra', 'A* Search', 'Breath-first Search', 'Depth-first Search'];
  mazesOptions = ['Duno', 'Duno']

  onAlgoClick() {
    this.onAlgoRunButtonWasClicked.emit();
  }

  onClearPath() {
    this.onClearPathWasClicked.emit();
  }

  onClearWalls() {
    this.onClearWallsWasClicked.emit();
  }
}
