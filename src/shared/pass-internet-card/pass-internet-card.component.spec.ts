import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassInternetCardComponent } from './pass-internet-card.component';

describe('PassInternetCardComponent', () => {
  let component: PassInternetCardComponent;
  let fixture: ComponentFixture<PassInternetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassInternetCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassInternetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
