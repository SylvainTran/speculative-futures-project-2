import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPartyDisplayComponent } from './avatar-party-display.component';

describe('AvatarPartyDisplayComponent', () => {
  let component: AvatarPartyDisplayComponent;
  let fixture: ComponentFixture<AvatarPartyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarPartyDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarPartyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
