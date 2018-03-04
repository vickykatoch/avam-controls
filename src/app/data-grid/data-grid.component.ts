import { Component, OnInit, Input } from '@angular/core';
import { GridColumn } from './models/grid-column';

@Component({
  selector: 'avam-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit {

  @Input() columns : GridColumn[];
  @Input() data: any[];
  colWidth=100;

  constructor() { }

  ngOnInit() {
  }

}
