import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviConsoComponent } from './suivi-conso.component';
import { FormatSuiviConsoCategoryTitlePipe } from 'src/shared/pipes/format-suivi-conso-category-title.pipe';

describe('SuiviConsoComponent', () => {
  let component: SuiviConsoComponent;
  let fixture: ComponentFixture<SuiviConsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuiviConsoComponent, FormatSuiviConsoCategoryTitlePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
