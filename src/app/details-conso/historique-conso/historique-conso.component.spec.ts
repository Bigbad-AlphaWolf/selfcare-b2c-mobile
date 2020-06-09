import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueConsoComponent } from './historique-conso.component';
import { MatMenuModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';

describe('HistoriqueConsoComponent', () => {
  let component: HistoriqueConsoComponent;
  let fixture: ComponentFixture<HistoriqueConsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueConsoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatMenuModule],
      providers: [{ provide: HttpClient, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
