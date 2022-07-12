import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilinfoComponent } from './soilinfo.component';

describe('SoilinfoComponent', () => {
  let component: SoilinfoComponent;
  let fixture: ComponentFixture<SoilinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoilinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
