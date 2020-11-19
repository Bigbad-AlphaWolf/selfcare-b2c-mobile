import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RattachedPhonesNumberPage } from './rattached-phones-number.page';

describe('RattachedPhonesNumberPage', () => {
  let component: RattachedPhonesNumberPage;
  let fixture: ComponentFixture<RattachedPhonesNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RattachedPhonesNumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RattachedPhonesNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
