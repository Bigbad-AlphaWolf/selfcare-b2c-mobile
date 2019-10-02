import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SosSuccessFailComponent } from './sos-success-fail.component';

describe('SosSuccessFailComponent', () => {
  let component: SosSuccessFailComponent;
  let fixture: ComponentFixture<SosSuccessFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SosSuccessFailComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SosSuccessFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
