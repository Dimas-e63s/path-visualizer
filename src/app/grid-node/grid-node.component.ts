import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Node} from '../models/Node.class';

@Component({
  selector: 'app-grid-node',
  templateUrl: './grid-node.component.html',
  styleUrls: ['./grid-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridNodeComponent implements OnChanges{
  @Input() vm!: Node;
  @Input() listen!: boolean;
  @Output() addedWall = new EventEmitter<{col: number, row: number}>();
  @Output() mouseEnter = new EventEmitter<{col: number, row: number}>();

  constructor(private cd: ChangeDetectorRef) {
    this.cd.detach();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(_: MouseEvent) {
      this.addedWall.emit({row: this.vm.getRowIdx(), col: this.vm.getColumnIdx()});
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.mouseEnter.emit({row: this.vm.getRowIdx(), col: this.vm.getColumnIdx()});
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cd.detectChanges();
  }

  classNames() {
    const BASE_CLASS = 'node';
    return {
      [`${BASE_CLASS}--start`]: this.vm.getIsStartNode(),
      [`${BASE_CLASS}--finish`]: this.vm.getIsFinishNode(),
      [`${BASE_CLASS}--visited`]: this.vm.isVisitedNode(),
      [`${BASE_CLASS}--wall`]: this.vm.isWall(),
      [`${BASE_CLASS}--path`]: this.vm.getIsShortestPath()
    };
  }
}
