import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapidoSoldeComponent } from './rapido-solde.component';

describe('RapidoSoldeComponent', () => {
  let component: RapidoSoldeComponent;
  let fixture: ComponentFixture<RapidoSoldeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapidoSoldeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapidoSoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
