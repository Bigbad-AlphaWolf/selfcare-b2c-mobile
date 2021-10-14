import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { of } from 'rxjs';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

import { IbouIonFabComponent } from './ibou-ion-fab.component';

describe('IbouIonFabComponent', () => {
  let component: IbouIonFabComponent;
  let fixture: ComponentFixture<IbouIonFabComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IbouIonFabComponent],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: HttpClient,
            useValue: {},
          },
          {
            provide: Location,
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {},
            },
          },
          {
            provide: SocialSharing,
            useValue: {
              share: () => {
                return of().toPromise();
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IbouIonFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
