import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLinkedNumbersPage } from './delete-linked-numbers.page';

describe('DeleteLinkedNumbersPage', () => {
  let component: DeleteLinkedNumbersPage;
  let fixture: ComponentFixture<DeleteLinkedNumbersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLinkedNumbersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLinkedNumbersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
