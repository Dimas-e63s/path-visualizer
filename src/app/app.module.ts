import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiNotificationModule,
  TuiRootModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {GridNodeComponent} from './components/grid-node/grid-node.component';
import {HeaderComponent} from './components/header/header.component';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {LegendComponent} from './components/legend/legend.component';

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
    TuiNotificationModule,
    TuiSvgModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
