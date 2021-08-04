import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskCardComponent } from './kiosk-card.component';

describe('KioskCardComponent', () => {
  let component: KioskCardComponent;
  let fixture: ComponentFixture<KioskCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
