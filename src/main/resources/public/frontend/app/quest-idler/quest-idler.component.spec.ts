import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestIdlerComponent } from './quest-idler.component';

describe('QuestIdlerComponent', () => {
  let component: QuestIdlerComponent;
  let fixture: ComponentFixture<QuestIdlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestIdlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestIdlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
