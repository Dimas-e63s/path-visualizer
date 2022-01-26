import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TuiHostedDropdownComponent} from '@taiga-ui/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent  {
  @ViewChild(TuiHostedDropdownComponent)
  component?: TuiHostedDropdownComponent;

  @Input() items!: string[];
  @Input() buttonText!: string;
  @Input() canOpen!: boolean;
  @Output() itemSelected = new EventEmitter<any>();


  open = false;

  onClick(item: any) {
    this.open = false;

    if (this.component && this.component.nativeFocusableElement) {
      this.component.nativeFocusableElement.focus();
    }

    this.emitSelectedOption(item);
  }

  private emitSelectedOption(item: any): void {
    if (this.canOpen) {
      this.itemSelected.emit(item);
    }
  }
}
