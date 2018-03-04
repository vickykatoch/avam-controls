import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScollContainerComponent } from './scoll-container.component';

describe('ScollContainerComponent', () => {
  let component: ScollContainerComponent;
  let fixture: ComponentFixture<ScollContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScollContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScollContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
