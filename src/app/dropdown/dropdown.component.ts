import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TuiHostedDropdownComponent} from '@taiga-ui/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent  {
  @ViewChild(TuiHostedDropdownComponent)
  component?: TuiHostedDropdownComponent;
  @Input() items!: string[];
  @Input() buttonText!: string;
  @Output() itemSelected = new EventEmitter<any>();


  open = false;

  onClick(item: any) {
    this.open = false;

    if (this.component && this.component.nativeFocusableElement) {
      this.component.nativeFocusableElement.focus();
    }

    this.itemSelected.emit(item);
  }

}
