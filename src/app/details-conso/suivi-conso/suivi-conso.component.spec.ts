import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuiviConsoComponent } from './suivi-conso.component';
import { FormatSuiviConsoCategoryTitlePipe } from 'src/shared/pipes/format-suivi-conso-category-title.pipe';

describe('SuiviConsoComponent', () => {
  let component: SuiviConsoComponent;
  let fixture: ComponentFixture<SuiviConsoComponent>;

  beforeEach(waitForAsync(() => {
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
