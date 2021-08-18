import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperationSuccessFailModalPage } from './operation-success-fail-modal.page';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { CodeFormatPipe } from '../pipes/code-format/code-format.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('OperationSuccessFailModalPage', () => {
  let component: OperationSuccessFailModalPage;
  let fixture: ComponentFixture<OperationSuccessFailModalPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          OperationSuccessFailModalPage,
          PhoneNumberDisplayPipe,
          CodeFormatPipe,
        ],
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          { provide: HttpClient },
          { provide: HttpHandler },
          { provide: Location },
          { provide: ModalController },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSuccessFailModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
