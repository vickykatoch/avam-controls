import { Component, OnInit } from '@angular/core';
import { Emp,EmployeeBuilder } from './test/test-data';
import { GridColumn } from '../data-grid/models/grid-column';

@Component({
  selector: 'app-grid-sample',
  templateUrl: './grid-sample.component.html',
  styleUrls: ['./grid-sample.component.scss']
})
export class GridSampleComponent implements OnInit {
  employees: Emp[] = [];
  columns : GridColumn[]= [];

  constructor() { }

  ngOnInit() {
    this.buildColumns();
    this.employees = EmployeeBuilder.buildEmpData(10);
  }


  private buildColumns() {
    this.columns.push({ name : 'id', caption : 'ID', width: 100, visible: true });
    this.columns.push({ name : 'firstName', caption : 'First Name', width: 100, visible: true });
    this.columns.push({ name : 'lastName', caption : 'Last Name', width: 100, visible: true });
    this.columns.push({ name : 'gender', caption : 'Gender', width: 100, visible: true });
    this.columns.push({ name : 'age', caption : 'Age', width: 100, visible: true });
  }
}
