import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNumberByIdClientPage } from './add-number-by-id-client.page';

describe('AddNumberByIdClientPage', () => {
  let component: AddNumberByIdClientPage;
  let fixture: ComponentFixture<AddNumberByIdClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNumberByIdClientPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNumberByIdClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
