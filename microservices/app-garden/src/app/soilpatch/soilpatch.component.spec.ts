import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilpatchComponent } from './soilpatch.component';

describe('SoilpatchComponent', () => {
  let component: SoilpatchComponent;
  let fixture: ComponentFixture<SoilpatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoilpatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilpatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
