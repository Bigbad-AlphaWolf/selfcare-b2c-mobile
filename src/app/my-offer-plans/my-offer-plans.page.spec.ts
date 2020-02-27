import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOfferPlansPage } from './my-offer-plans.page';

describe('MyOfferPlansPage', () => {
  let component: MyOfferPlansPage;
  let fixture: ComponentFixture<MyOfferPlansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOfferPlansPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOfferPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
