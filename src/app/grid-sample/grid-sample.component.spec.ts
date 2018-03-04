import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSampleComponent } from './grid-sample.component';

describe('GridSampleComponent', () => {
  let component: GridSampleComponent;
  let fixture: ComponentFixture<GridSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
