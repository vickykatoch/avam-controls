import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteGridSampleComponent } from './infinite-grid-sample.component';

describe('InfiniteGridSampleComponent', () => {
  let component: InfiniteGridSampleComponent;
  let fixture: ComponentFixture<InfiniteGridSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfiniteGridSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteGridSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
