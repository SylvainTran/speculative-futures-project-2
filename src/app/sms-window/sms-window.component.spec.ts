import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsWindowComponent } from './sms-window.component';

describe('SmsWindowComponent', () => {
  let component: SmsWindowComponent;
  let fixture: ComponentFixture<SmsWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
