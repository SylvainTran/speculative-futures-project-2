import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInterfaceComponent } from './menu-interface.component';

describe('MenuInterfaceComponent', () => {
  let component: MenuInterfaceComponent;
  let fixture: ComponentFixture<MenuInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuInterfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
