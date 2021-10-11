import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { DalalActivationSuccessModalComponent } from './dalal-activation-success-modal.component';

describe('DalalActivationSuccessModalComponent', () => {
  let component: DalalActivationSuccessModalComponent;
  let fixture: ComponentFixture<DalalActivationSuccessModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: ModalController,
            useValue: {},
          },
          {
            provide: Router,
            useValue: {},
          },
        ],
        declarations: [DalalActivationSuccessModalComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DalalActivationSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
