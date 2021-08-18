import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KioskSearchComponent } from './kiosk-search.component';

describe('KioskSearchComponent', () => {
  let component: KioskSearchComponent;
  let fixture: ComponentFixture<KioskSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule],
        declarations: [KioskSearchComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [FormBuilder],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
