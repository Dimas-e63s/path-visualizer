import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiRootModule, TuiSvgModule} from '@taiga-ui/core';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {GridNodeComponent} from './grid-node/grid-node.component';
import {HeaderComponent} from './header/header.component';
import {DropdownComponent} from './dropdown/dropdown.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [
    AppComponent,
    GridNodeComponent,
    HeaderComponent,
    DropdownComponent,
    LegendComponent,
  ],
  imports: [
    BrowserModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiSvgModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
