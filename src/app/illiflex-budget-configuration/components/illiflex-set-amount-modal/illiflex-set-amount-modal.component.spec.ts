import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IlliflexSetAmountModalComponent } from './illiflex-set-amount-modal.component';

describe('IlliflexSetAmountModalComponent', () => {
  let component: IlliflexSetAmountModalComponent;
  let fixture: ComponentFixture<IlliflexSetAmountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IlliflexSetAmountModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IlliflexSetAmountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});