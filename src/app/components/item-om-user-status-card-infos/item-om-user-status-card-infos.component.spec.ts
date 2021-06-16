import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOmUserStatusCardInfosComponent } from './item-om-user-status-card-infos.component';

describe('ItemOmUserStatusCardInfosComponent', () => {
  let component: ItemOmUserStatusCardInfosComponent;
  let fixture: ComponentFixture<ItemOmUserStatusCardInfosComponent>;

  beforeEach(async(() => {
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
