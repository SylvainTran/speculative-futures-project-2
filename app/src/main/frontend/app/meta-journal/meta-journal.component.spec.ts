import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaJournalComponent } from './meta-journal.component';

describe('MetaJournalComponent', () => {
  let component: MetaJournalComponent;
  let fixture: ComponentFixture<MetaJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
