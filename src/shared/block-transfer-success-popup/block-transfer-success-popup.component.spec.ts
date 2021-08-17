import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { PhoneNumberDisplayPipe } from '../pipes/phone-number-display.pipe';

import { BlockTransferSuccessPopupComponent } from './block-transfer-success-popup.component';

describe('BlockTransferSuccessPopupComponent', () => {
  let component: BlockTransferSuccessPopupComponent;
  let fixture: ComponentFixture<BlockTransferSuccessPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BlockTransferSuccessPopupComponent,
          PhoneNumberDisplayPipe,
        ],
        imports: [RouterTestingModule],
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
    fixture = TestBed.createComponent(BlockTransferSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
