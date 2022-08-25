import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaFriendListComponent } from './meta-friend-list.component';

describe('MetaFriendListComponent', () => {
  let component: MetaFriendListComponent;
  let fixture: ComponentFixture<MetaFriendListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaFriendListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaFriendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
