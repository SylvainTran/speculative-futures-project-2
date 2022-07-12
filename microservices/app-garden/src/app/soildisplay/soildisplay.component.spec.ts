import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoildisplayComponent } from './soildisplay.component';

describe('SoildisplayComponent', () => {
  let component: SoildisplayComponent;
  let fixture: ComponentFixture<SoildisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoildisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoildisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
