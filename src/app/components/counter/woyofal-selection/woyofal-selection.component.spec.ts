import {OverlayModule} from '@angular/cdk/overlay';
import {Location} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {UrlSerializer} from '@angular/router';
import {AngularDelegate, ModalController} from '@ionic/angular';
import {of} from 'rxjs';
import {CodeFormatPipe} from 'src/app/pipes/code-format/code-format.pipe';
import {BottomSheetService} from 'src/app/services/bottom-sheet/bottom-sheet.service';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {RecentsService} from 'src/app/services/recents-service/recents.service';

import {WoyofalSelectionComponent} from './woyofal-selection.component';

describe('WoyofalSelectionComponent', () => {
  let component: WoyofalSelectionComponent;
  let fixture: ComponentFixture<WoyofalSelectionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [OverlayModule, MatDialogModule],
        providers: [
          {
            provide: MatBottomSheet
          },
          {
            provide: BottomSheetService
          },
          {
            provide: UrlSerializer
          },
          {
            provide: Location
          },
          {
            provide: OrangeMoneyService,
            useValue: {
              getOmMsisdn: () => {
                return of();
              }
            }
          },
          {
            provide: RecentsService,
            useValue: {
              fetchRecents: () => {
                return of();
              }
            }
          },
          {
            provide: ModalController
          },
          {
            provide: MatDialog
          },
          {
            provide: AngularDelegate
          }
        ],
        declarations: [WoyofalSelectionComponent, CodeFormatPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WoyofalSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
