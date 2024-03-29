import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DistanceFormatPipe } from 'src/shared/pipes/distance-format.pipe';

import { KioskCardComponent } from './kiosk-card.component';

describe('KioskCardComponent', () => {
  let component: KioskCardComponent;
  let fixture: ComponentFixture<KioskCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [KioskCardComponent, DistanceFormatPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
