import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-scoll-container',
  templateUrl: './scoll-container.component.html',
  styleUrls: ['./scoll-container.component.scss']
})
export class ScollContainerComponent implements OnInit {
  @ViewChild('scollContainer') scrollContainer : ElementRef;

  constructor() { }

  ngOnInit() {
    fromEvent(this.scrollContainer.nativeElement,'scroll').subscribe((evt: Event)=> {
      console.log('scrolling');
      console.log(evt.target['scrollTop']);
    })
  }

}
