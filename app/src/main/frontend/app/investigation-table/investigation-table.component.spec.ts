import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationTableComponent } from './investigation-table.component';

describe('InvestigationTableComponent', () => {
  let component: InvestigationTableComponent;
  let fixture: ComponentFixture<InvestigationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
