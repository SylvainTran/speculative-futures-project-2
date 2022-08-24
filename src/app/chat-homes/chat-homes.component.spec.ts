import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHomesComponent } from './chat-homes.component';

describe('ChatHomesComponent', () => {
  let component: ChatHomesComponent;
  let fixture: ComponentFixture<ChatHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatHomesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
