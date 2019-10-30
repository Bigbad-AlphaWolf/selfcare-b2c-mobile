import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfolegalesPage } from './infolegales.page';

describe('InfolegalesPage', () => {
  let component: InfolegalesPage;
  let fixture: ComponentFixture<InfolegalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfolegalesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
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
