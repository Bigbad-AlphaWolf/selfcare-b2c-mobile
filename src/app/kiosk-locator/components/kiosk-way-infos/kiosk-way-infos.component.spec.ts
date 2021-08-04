import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskWayInfosComponent } from './kiosk-way-infos.component';

describe('KioskWayInfosComponent', () => {
  let component: KioskWayInfosComponent;
  let fixture: ComponentFixture<KioskWayInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskWayInfosComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskWayInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
