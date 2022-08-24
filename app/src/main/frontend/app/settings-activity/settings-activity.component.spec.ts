import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsActivityComponent } from './settings-activity.component';

describe('SettingsActivityComponent', () => {
  let component: SettingsActivityComponent;
  let fixture: ComponentFixture<SettingsActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
