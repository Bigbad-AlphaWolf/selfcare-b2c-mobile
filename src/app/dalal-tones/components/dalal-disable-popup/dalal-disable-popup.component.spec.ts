import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { DalalDisablePopupComponent } from './dalal-disable-popup.component';

describe('DalalDisablePopupComponent', () => {
  let component: DalalDisablePopupComponent;
  let fixture: ComponentFixture<DalalDisablePopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: ModalController,
            useValue: {},
          },
          {
            provide: HttpClient,
            useValue: {},
          },
        ],
        declarations: [DalalDisablePopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DalalDisablePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
