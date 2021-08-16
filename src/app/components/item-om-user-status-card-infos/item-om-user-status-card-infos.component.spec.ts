import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemOmUserStatusCardInfosComponent } from './item-om-user-status-card-infos.component';

describe('ItemOmUserStatusCardInfosComponent', () => {
  let component: ItemOmUserStatusCardInfosComponent;
  let fixture: ComponentFixture<ItemOmUserStatusCardInfosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemOmUserStatusCardInfosComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOmUserStatusCardInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
