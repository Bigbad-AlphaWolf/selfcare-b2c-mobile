import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { SetRecipientNamesModalComponent } from './set-recipient-names-modal.component';

describe('SetRecipientNamesModalComponent', () => {
  let component: SetRecipientNamesModalComponent;
  let fixture: ComponentFixture<SetRecipientNamesModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SetRecipientNamesModalComponent],
        imports: [ReactiveFormsModule, FormsModule],
        providers: [
          {
            provide: ModalController,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRecipientNamesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
