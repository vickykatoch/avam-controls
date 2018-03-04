import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { FormTestComponent } from './form-test/form-test.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { GridSampleComponent } from './grid-sample/grid-sample.component';
import { CoolInfiniteGridComponent } from './infinite-scroll/infinite-grid.component';
import { InfiniteGridSampleComponent } from './infinite-grid-sample/infinite-grid-sample.component';


@NgModule({
  declarations: [
    AppComponent,
    DropDownComponent,
    FormTestComponent,
    DataGridComponent,
    GridSampleComponent,
    CoolInfiniteGridComponent,
    InfiniteGridSampleComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
