import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Node} from '../models/Node.class';

@Component({
  selector: 'app-grid-node',
  templateUrl: './grid-node.component.html',
  styleUrls: ['./grid-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridNodeComponent {
  @Input() vm!: Node;
  @Input() listen!: boolean;
  @Output() addedWall = new EventEmitter<{col: number, row: number}>();
  @Output() mouseEnter = new EventEmitter<{col: number, row: number}>();

  @HostListener('mousedown', ['$event'])
  onMouseDown(_: MouseEvent) {
      this.addedWall.emit({row: this.vm.getRowIdx(), col: this.vm.getColumnIdx()});
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.mouseEnter.emit({row: this.vm.getRowIdx(), col: this.vm.getColumnIdx()});
  }

  classNames() {
    const BASE_CLASS = 'node';
    return {
      [`${BASE_CLASS}--start`]: this.vm.getIsStartNode(),
      [`${BASE_CLASS}--finish`]: this.vm.getIsFinishNode(),
      [`${BASE_CLASS}--visited`]: this.vm.isVisitedNode(),
      [`${BASE_CLASS}--wall`]: this.vm.isWall(),
      [`${BASE_CLASS}--path`]: this.vm.isShortestPath
    };
  }
}
