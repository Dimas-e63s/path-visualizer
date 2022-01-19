import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TUI_ARROW} from '@taiga-ui/kit';
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

  open = false;

  onClick() {
    this.open = false;

    if (this.component && this.component.nativeFocusableElement) {
      this.component.nativeFocusableElement.focus();
    }
  }

}
