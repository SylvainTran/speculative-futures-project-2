import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaMessageCenterComponent } from './meta-message-center.component';

describe('MetaMessageCenterComponent', () => {
  let component: MetaMessageCenterComponent;
  let fixture: ComponentFixture<MetaMessageCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaMessageCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaMessageCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
