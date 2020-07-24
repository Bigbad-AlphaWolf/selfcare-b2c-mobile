import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbouIonFabComponent } from './ibou-ion-fab.component';

describe('IbouIonFabComponent', () => {
  let component: IbouIonFabComponent;
  let fixture: ComponentFixture<IbouIonFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbouIonFabComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbouIonFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});