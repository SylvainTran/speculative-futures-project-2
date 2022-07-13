import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDungeonViewComponent } from './party-dungeon-view.component';

describe('PartyDungeonViewComponent', () => {
  let component: PartyDungeonViewComponent;
  let fixture: ComponentFixture<PartyDungeonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDungeonViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDungeonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
