import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RattachNumberByIdCardComponent } from './rattach-number-by-id-card.component'

describe('RattachNumberByIdCardComponent', () => {
  let component: RattachNumberByIdCardComponent;
  let fixture: ComponentFixture<RattachNumberByIdCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RattachNumberByIdCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RattachNumberByIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
