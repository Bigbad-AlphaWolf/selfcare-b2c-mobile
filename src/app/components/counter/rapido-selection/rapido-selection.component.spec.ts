import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material';
import { UrlSerializer } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';

import { RapidoSelectionComponent } from './rapido-selection.component';

describe('RapidoSelectionComponent', () => {
  let component: RapidoSelectionComponent;
  let fixture: ComponentFixture<RapidoSelectionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MatBottomSheet,
          },
          {
            provide: OrangeMoneyService,
            useValue: {
              omAccountSession: () => {
                return of();
              },
            },
          },
          {
            provide: RecentsService,
            useValue: {
              fetchRecents: () => {
                return of();
              },
            },
          },
          {
            provide: FavorisService,
            useValue: {
              favoritesByService: () => {
                return of();
              },
              saveRapidoFavorite: () => {
                return of();
              },
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return of();
              },
            },
          },
          {
            provide: BottomSheetService,
          },
          {
            provide: UrlSerializer,
          },
          {
            provide: Location,
          },
          {
            provide: ModalController,
          },
        ],
        declarations: [RapidoSelectionComponent, CodeFormatPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RapidoSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
