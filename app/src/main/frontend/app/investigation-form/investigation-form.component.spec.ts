import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationFormComponent } from './investigation-form.component';

describe('InvestigationFormComponent', () => {
  let component: InvestigationFormComponent;
  let fixture: ComponentFixture<InvestigationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
