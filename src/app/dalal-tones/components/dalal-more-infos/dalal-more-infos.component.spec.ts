import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DalalMoreInfosComponent } from './dalal-more-infos.component';

describe('DalalMoreInfosComponent', () => {
  let component: DalalMoreInfosComponent;
  let fixture: ComponentFixture<DalalMoreInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DalalMoreInfosComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DalalMoreInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
