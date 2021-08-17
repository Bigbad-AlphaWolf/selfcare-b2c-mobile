import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DataVolumePipe } from 'src/shared/pipes/data-volume.pipe';
import { IlliflexVoicePipe } from 'src/shared/pipes/illiflex-voice.pipe';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';

import { IlliflexConfigurationPage } from './illiflex-configuration.page';

describe('IlliflexConfigurationPage', () => {
  let component: IlliflexConfigurationPage;
  let fixture: ComponentFixture<IlliflexConfigurationPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          IlliflexConfigurationPage,
          DataVolumePipe,
          IlliflexVoicePipe,
        ],
        providers: [
          {
            provide: Location,
          },
          {
            provide: IlliflexService,
            useValue: {
              getIlliflexPaliers: () => {
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
            provide: UrlSerializer,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IlliflexConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
