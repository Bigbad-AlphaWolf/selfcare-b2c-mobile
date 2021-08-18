import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatBottomSheet, MatDialog, MatDialogModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

import { BottomSheetService } from './bottom-sheet.service';

describe('BottomSheetService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, OverlayModule, MatDialogModule],
      providers: [
        AngularDelegate,
        {
          provide: MatBottomSheet,
        },
        {
          provide: MatDialog,
        },
        {
          provide: ModalController,
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOmMsisdn: () => {
              return of();
            },
          },
        },
      ],
    })
  );

  it('should be created', () => {
    const service: BottomSheetService = TestBed.get(BottomSheetService);
    expect(service).toBeTruthy();
  });
});
