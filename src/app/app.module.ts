import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { FormTestComponent } from './form-test/form-test.component';
import { DataGridComponent } from './data-grid/data-grid.component';


@NgModule({
  declarations: [
    AppComponent,
    DropDownComponent,
    FormTestComponent,
    DataGridComponent
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
