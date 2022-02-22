import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {DescriptionFactory} from './notification';
import {PathAlgorithmEnum} from '../header/header.component';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendComponent {
  @Input() selectedAlgorithm!: PathAlgorithmEnum | null;

  legendItems = [
    {
      className: '--path',
      description: 'Shortest-path Node',
    },
    {
      className: '--wall',
      description: 'Wall Node',
    },
    {
      className: '--visited',
      description: 'Visited Node',
    },
    {
      className: '--unvisited',
      description: 'Unvisited Node',
    },
  ];

  icons = [
    {
      className: '--start',
      description: 'Start Node',
      disabled: false,
    },
    {
      className: '--target',
      description: 'Target Node',
      disabled: false,
    },
    {
      className: '--weight',
      description: 'Weight Node',
      disabled: true,
    },
    {
      className: '--bomb',
      description: 'Bomb Node',
      disabled: true,
    },
  ];

  getNotificationDescription(): string {
    return DescriptionFactory.main(this.selectedAlgorithm);
  }
}
