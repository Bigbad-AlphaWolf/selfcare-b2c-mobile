import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';

import { SimpleOperationSuccessModalComponent } from './simple-operation-success-modal.component';

describe('SimpleOperationSuccessModalComponent', () => {
  let component: SimpleOperationSuccessModalComponent;
  let fixture: ComponentFixture<SimpleOperationSuccessModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SimpleOperationSuccessModalComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: ModalController,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleOperationSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
