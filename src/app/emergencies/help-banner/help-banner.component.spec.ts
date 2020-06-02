import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBannerComponent } from './help-banner.component';

describe('HelpBannerComponent', () => {
  let component: HelpBannerComponent;
  let fixture: ComponentFixture<HelpBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpBannerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
