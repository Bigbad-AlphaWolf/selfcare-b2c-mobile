import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfolegalesPage } from './infolegales.page';
import { Router } from '@angular/router';

describe('InfolegalesPage', () => {
  let component: InfolegalesPage;
  let fixture: ComponentFixture<InfolegalesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InfolegalesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: Router }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfolegalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
