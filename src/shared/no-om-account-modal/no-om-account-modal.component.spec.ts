import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoOmAccountModalComponent } from './no-om-account-modal.component';
import { ModalController } from '@ionic/angular';

describe('NoOmAccountModalComponent', () => {
  let component: NoOmAccountModalComponent;
  let fixture: ComponentFixture<NoOmAccountModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NoOmAccountModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoOmAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
