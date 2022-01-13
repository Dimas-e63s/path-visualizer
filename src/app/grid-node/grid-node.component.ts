import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-grid-node',
  templateUrl: './grid-node.component.html',
  styleUrls: ['./grid-node.component.scss'],
})
export class GridNodeComponent implements OnInit {
  @Input() vm: any;
  constructor() { }

  ngOnInit(): void {
  }

  classNames() {
    const BASE_CLASS = 'node';
    return {
      [`${BASE_CLASS}--start`]: this.vm?.getIsStartNode(),
      [`${BASE_CLASS}--finish`]: this.vm?.getIsFinishNode()
    }
  }
}
