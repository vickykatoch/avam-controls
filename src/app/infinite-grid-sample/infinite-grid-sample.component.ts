import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infinite-grid-sample',
  templateUrl: './infinite-grid-sample.component.html',
  styleUrls: ['./infinite-grid-sample.component.scss']
})
export class InfiniteGridSampleComponent implements OnInit {
  items: any[] = [];
  myItemIterator: any;

  constructor() {
    for (let i = 0; i < 100000; i++) {
      this.items.push({
        name: i,
        color: "#" + ((1 << 24) * Math.random() | 0).toString(16)
      });
    }
    this.myItemIterator = {
      next: (fromIndex, length) => {
        console.log(`Getting items from: ${fromIndex} to ${fromIndex + length}`);

        let value = this.items.slice(fromIndex, fromIndex + length);
        if (!value.length) {
          value = null;
        }

        return {
          value: Promise.resolve(value),
          done: false
        };
      }
    };
  }

  ngOnInit() {
    
  }
  changeColor(item) {
    item.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
  }

}
